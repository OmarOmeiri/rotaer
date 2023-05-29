'use client';

import merge from 'lodash/merge';
import dynamic from 'next/dynamic';
/* eslint-disable require-jsdoc */
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import styled, { css } from 'styled-components';
import {
  ColumnDef,
  ColumnDefCustom,
  ColumnOrderState,
  ColumnResizeMode,
  ColumnSizingState,
  CustomColumn,
  getCoreRowModel,
  Row,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { getPxFromCssDimensionString } from '@/utils/Styles/unitConvert';
import { useDragScroll } from '../../hooks/DOM/useDragScroll';
import ScrollBar from '../ScrollBar/Scrollbar';
import { Skeleton } from '../Skeleton/Skeleton';
import {
  TableStyles,
  tableStyles,
} from './styles';
import { HeaderGroup } from './subComponents/Header/HeaderGroup';
import { RowSelectCheckbox } from './subComponents/RowSelect/RowSelectCheckbox';
import { TBody } from './subComponents/TBody/TBody';
import classes from './Table.module.css';

const LogoAbducted = dynamic(() => import('@/components/Icons/Data/LogoAbducted'));

const DEFAULT_BOTTOM_REACH_OFFSET = 450;
const DEFAULT_COLUMN_SIZE = 150;

export type TableHeadersRef = {id: string, element: HTMLDivElement | null}[] | null

export type TableRef = {
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>
  tableContainerRef: React.MutableRefObject<HTMLDivElement | null>
  headerGroupRef: React.MutableRefObject<HTMLDivElement | null>,
  getState: () => TableState
}

export type TableState = {
  columnOrder: ColumnOrderState;
  columnSizing: ColumnSizingState;
  pinnedColumns: string[] | undefined;
}

type TableClassNames = {
  wrapper?: string,
  bodyWrapper?: string,
  headerGroup?: string,
}

export type TableHeaderTooltips<T extends Record<string, unknown>> = {
  [K in keyof T]?: JSX.Element
}

interface BaseProps<T extends Record<string, unknown>> {
  cols: ColumnDefCustom<T>[],
  data: T[],
  headerRefs?: React.MutableRefObject<TableHeadersRef>,
  sorting?: DBSorting<any>,
  columnResizeMode?: ColumnResizeMode,
  columnAutoSizing?: true,
  loading?: boolean,
  bottomReachOffset?: number,
  styles?: DeepPartial<TableStyles>
  pinnedColumns?: (keyof T)[]
  loadingMore?: boolean,
  inlineStyles?: {
    tableWrapper?: React.CSSProperties
  }
  tableState?: Partial<TableState>,
  classNames?: TableClassNames;
  headerTooltips?: TableHeaderTooltips<T>,
  onColumnPin?: (id: string) => void,
  onSortingChange?: (e: React.MouseEvent | React.KeyboardEvent, col: CustomColumn<T>) => void,
  onBottomReach?: () => void,
  noData?: boolean
  noDataMsg?: string,
  skeletonRows?: number
}

interface WithRowSelectionProps<T extends Record<string, unknown>> extends BaseProps<T> {
  withRowSelection: true,
  onRowSelect?: (selection: RowSelectionState) => void,
  rowId: ((originalRow: T, index: number, parent?: Row<T> | undefined) => string)
}

interface NoRowSelectionProps<T extends Record<string, unknown>> extends BaseProps<T> {
  withRowSelection?: undefined,
  onRowSelect?: undefined
  rowId?: ((originalRow: T, index: number, parent?: Row<T> | undefined) => string)
}

type Props<T extends Record<string, unknown>> =
WithRowSelectionProps<T>
| NoRowSelectionProps<T>

const BodyWrapper = styled.div`
${({ styles: { header } }: {styles: TableStyles}) => css`
height: calc(100% - ${header.height});
`}`;

const withRowSelect = <T extends Record<string, unknown>>(
  cols: ColumnDefCustom<T, unknown>[],
): ColumnDefCustom<T, unknown>[] => {
  if (!cols.length) return [];
  return [
    {
      id: 'row-select',
      draggable: false,
      header: ({ table }) => (
        <RowSelectCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      maxSize: 50,
      align: 'center',
      enableResizing: false,
      cell: ({ row }) => (
        <div className="px-1">
          <RowSelectCheckbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
    },
    ...cols,
  ];
};

const withDummyRows = <T extends Record<string, unknown>>({
  data,
  rowHeight,
  minHeight,
}:{
  data: T[],
  rowHeight: string,
  minHeight: string
}) => {
  const { length } = data;
  const rowHeightNum = getPxFromCssDimensionString(rowHeight);
  const dataHeight = length * rowHeightNum;
  const minHeightNum = getPxFromCssDimensionString(minHeight);
  const dummyRowCount = Math.max(Math.floor((minHeightNum - dataHeight) / rowHeightNum), 0);
  const keys = Array.from(new Set(
    data.slice(0, 5).flatMap((d) => Object.keys(d || {})),
  ));

  return [
    ...data,
    ...Array(dummyRowCount).fill(null).map(() => (
      keys.reduce((obj, k) => ({
        ...obj,
        [k]: '',
      }), { dummyRow: true } as unknown as T)
    )),
  ];
};

function Tbl<T extends Record<string, unknown>>({
  data: inputData,
  cols,
  sorting,
  headerRefs,
  columnResizeMode = 'onChange',
  columnAutoSizing,
  withRowSelection,
  bottomReachOffset = DEFAULT_BOTTOM_REACH_OFFSET,
  pinnedColumns,
  styles: partialStyles,
  loading,
  loadingMore,
  classNames,
  headerTooltips,
  tableState,
  noData,
  noDataMsg,
  skeletonRows = 10,
  onRowSelect,
  rowId,
  onColumnPin,
  onSortingChange,
  onBottomReach,
}: Props<T>, ref: React.ForwardedRef<TableRef>) {
  const { ref: inViewRef, inView } = useInView();
  const styles: TableStyles = useMemo(() => merge({}, tableStyles, partialStyles), [partialStyles]);

  const {
    data,
    columns,
    hasDummyRows,
  } = React.useMemo(() => {
    const rows = withDummyRows({ data: inputData, rowHeight: styles.body.row.height, minHeight: styles.body.minHeight });
    return {
      data: rows,
      columns: withRowSelection ? withRowSelect(cols) : cols,
      hasDummyRows: inputData.length !== rows.length,
    };
  }, [inputData, withRowSelection, cols, styles]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const headerGroupRef = useRef<HTMLDivElement | null>(null);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(tableState?.columnOrder || []);

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    tableState?.columnSizing
    || {},
  );

  const getState = (): TableState => ({
    columnOrder,
    columnSizing,
    pinnedColumns: pinnedColumns as string[] | undefined,
  });

  useImperativeHandle(ref, () => ({
    wrapperRef,
    tableContainerRef,
    headerGroupRef,
    getState,
  }));

  useEffect(() => {
    if (tableState?.columnOrder) setColumnOrder(tableState.columnOrder);
    if (tableState?.columnSizing) setColumnSizing(tableState.columnSizing);
  }, [tableState]);

  useEffect(() => {
    if (onRowSelect) onRowSelect(rowSelection);
  }, [rowSelection, onRowSelect]);

  useEffect(() => {
    setColumnOrder(
      tableState?.columnOrder
      || columns.map((c) => c.id as string),
    );
    setColumnSizing(
      tableState?.columnSizing
      || Object.fromEntries(columns.map((c) => [c.id, c.size || DEFAULT_COLUMN_SIZE])),
    );
  }, [columns, tableState]);

  useEffect(() => {
    if (inView && tableContainerRef.current) {
      if (onBottomReach) onBottomReach();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useDragScroll({ ref: wrapperRef, ignoreIfChildOf: headerGroupRef });

  const table = useReactTable<T>({
    data,
    columns: columns as ColumnDef<T>[],
    state: {
      columnOrder,
      columnSizing,
      rowSelection,
    },
    meta: {
      styles,
    },
    columnResizeMode,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    getRowId: (originalRow: T, index: number, parent?: Row<T>) => {
      if (originalRow.dummyRow) return `empty-${index}`;
      return rowId ? rowId(originalRow, index, parent) : index.toString();
    },
    manualSorting: true,
  });

  const isColumnResizing = !!table.getState().columnSizingInfo.isResizingColumn;
  return (
    <div ref={wrapperRef} className={`${classes.TableWrapper} ${classNames?.wrapper || ''} noselect`}>
      {
        noData
          ? (
            <LogoAbducted message={noDataMsg} animate/>
          )
          : null
      }
      <ScrollBar elm={wrapperRef}/>
      <HeaderGroup
        table={table}
        headerRefs={headerRefs}
        columnResizeMode={columnResizeMode}
        columnOrder={columnOrder}
        ref={headerGroupRef}
        sorting={sorting}
        columnAutoSizing={columnAutoSizing}
        headerTooltips={headerTooltips}
        styles={styles}
        classNames={{ headerGroup: classNames?.headerGroup }}
        onColumnPin={onColumnPin}
        pinnedColumns={pinnedColumns}
        setColumnOrder={setColumnOrder}
        onSortingChange={onSortingChange}
      />
      <BodyWrapper
        ref={tableContainerRef}
        styles={styles}
        className={`${classes.Table}  ${classNames?.bodyWrapper || ''}`}
      >
        {
          loading || !data.length
            ? (
              Array(skeletonRows).fill(null).map((_, i) => (
                <Skeleton
                  key={`tbl-skeleton-${i}`}
                  box={{
                    sx: {
                      height: styles.body.row.height,
                      padding: '0.15em',
                      width: '100%',
                      backgroundColor: i % 2 === 0 ? styles.body.row.background.even : styles.body.row.background.odd,
                      '& .MuiSkeleton-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.21)',
                      },
                    },
                  }}
                  skeleton={{ sx: { height: '100%' } }}
                />
              ))
            )
            : <TBody
                table={table}
                columnOrder={columnOrder}
                isResizing={isColumnResizing}
                tableContainerRef={tableContainerRef}
                styles={styles}
                wrapperRef={wrapperRef}
                pinnedColumns={pinnedColumns}
                loadingMore={loadingMore}
              />
        }
        {
          data.length && cols.length && !hasDummyRows && onBottomReach
            ? (
              <div ref={inViewRef} style={{
                height: `${bottomReachOffset}px`,
                position: 'absolute',
                top: (tableContainerRef?.current?.scrollHeight || bottomReachOffset) - bottomReachOffset,
                backgroundColor: 'transparent',
                pointerEvents: 'none',
                width: '100%',
              }}/>
            ) : null
        }
      </BodyWrapper>
    </div>
  );
}

const Table = React.memo(React.forwardRef(Tbl));
export default Table;
