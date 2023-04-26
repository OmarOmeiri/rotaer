/* eslint-disable require-jsdoc */

import {
  memo,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import {
  ColumnOrderState,
  Row,
  Table,
} from '@tanstack/react-table';
import { useVirtual } from '@tanstack/react-virtual';
import { FloatingSpinner } from '../../../Loading/FloatingSpinner';
import { TableRow } from '../Row/Row';
import classes from './TBody.module.css';

import type { TableStyles } from '../../styles';
type Props<T extends Record<string, unknown>> = {
  table: Table<T>,
  columnOrder: ColumnOrderState,
  tableContainerRef: React.MutableRefObject<HTMLDivElement | null>
  styles: TableStyles
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>,
  pinnedColumns?: (keyof T)[]
  loadingMore?: boolean,
  // eslint-disable-next-line react/no-unused-prop-types
  isResizing: boolean, // Needed to avois stuttering when column is resizing
}

const typedMemo: <T>(
  c: T,
  propsAreEqual?: ((prevProps: Readonly<Props<any>>, nextProps: Readonly<Props<any>>) => boolean) | undefined
) => T = memo;

const StyledTBody = styled.div`
${({ styles: { body } }: {styles: TableStyles}) => (
    css`
      min-width: 100%;
      color: ${body.color};
      font-size: ${body.fontSize};
    `
  )}`;

function TBodyMemo<T extends Record<string, unknown>>({
  table,
  tableContainerRef,
  styles,
  pinnedColumns,
  wrapperRef,
  loadingMore,
  columnOrder,
}: Props<T>) {
  const [highlightedRows, setHighLightedRows] = useState<string[]>([]);
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 11,
    estimateSize: () => Number(styles.body.row.height.replace(/[^\d]/g, '')),
  });

  const { virtualItems, totalSize } = rowVirtualizer;
  const paddingTop = virtualItems.length > 0 ? virtualItems?.[0]?.start || 0 : 0;
  const paddingBottom = virtualItems.length > 0
    ? totalSize - (virtualItems?.[virtualItems.length - 1]?.end || 0)
    : 0;

  return (
    <>
      <StyledTBody
        style={{
          width: table.getCenterTotalSize(),
          ...(styles?.body || {}),
        }}
        className={classes.TBody}
        styles={styles}
      >
        {paddingTop > 0 && (
          <div>
            <div style={{ height: `${paddingTop}px` }} />
          </div>
        )}
        {
          virtualItems.map((virtualItem) => {
            const row = rows[virtualItem.index] as Row<T>;
            return (
              <TableRow
                key={row.id}
                row={row}
                pinnedColumns={pinnedColumns}
                index={virtualItem.index}
                columnOrder={columnOrder}
                styles={styles}
                wrapperRef={wrapperRef}
                highLightedRows={highlightedRows}
                setHighLightedRows={setHighLightedRows}
              />
            );
          })
        }
        {paddingBottom > 0 && (
          <div>
            <div style={{ height: `${paddingBottom}px` }} />
          </div>
        )}
      </StyledTBody>
      {
        loadingMore
          ? (
            <div
              style={{
                height: styles.body.row.height,
                backgroundColor: (virtualItems[virtualItems.length - 1].index + 1) % 2 === 0
                  ? styles.body.row.background.even
                  : styles.body.row.background.odd,
              }}
              className={classes.LoadingMoreWrapper}
            >
              <FloatingSpinner/>
            </div>
          )
          : null
      }
    </>
  );
}

export const TBody = typedMemo(
  TBodyMemo,
  (_prevProps, nextProps) => nextProps.isResizing,
);

