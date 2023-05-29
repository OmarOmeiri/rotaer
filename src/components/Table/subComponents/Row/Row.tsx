import React, {
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  Row,
  flexRender,
  ColumnOrderState,
  ColumnDefCustom,
  Cell,
  ColumnDefTemplate,
  CellContext,
} from '@tanstack/react-table';
import styled, { css } from 'styled-components';
import classes from './Row.module.css';
import { TableStyles } from '../../styles';

/* eslint-disable require-jsdoc */
type Props<T extends Record<string, unknown>> = {
  row: Row<T>,
  index: number,
  // eslint-disable-next-line react/no-unused-prop-types
  columnOrder: ColumnOrderState, // This is needed for the memo re-render when order changes
  highLightedRows: string[],
  pinnedColumns?: (keyof T)[],
  styles: TableStyles
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>,
  className?: string,
  setHighLightedRows: SetState<string[]>
}

const Tr = styled.div`
${({ styles: { body: { row } }, index }: {index: number, styles: TableStyles}) => {
    if (index % 2 === 0) {
      return css`
      height: ${row.height};
      background-color: ${row.background.even};`;
    }
    return css`
      height: ${row.height};
      background-color: ${row.background.odd};`;
  }}`;

const Td = styled.div`
${({ styles: { body: { row } } }: {styles: TableStyles}) => css`
    border-top: ${
  row.border.horizontal.width
} ${
  row.border.horizontal.style
} ${
  row.border.horizontal.color
};
    border-right: ${
  row.border.vertical.width
} ${
  row.border.vertical.style
} ${
  row.border.vertical.color
};`
}`;

type TDWrapperProps = {
  styles: TableStyles,
  cell: Cell<any, unknown>,
  pinned: boolean
  index: number,
  scrollX: number,
}

const TdWrapper = styled.div.attrs(({
  styles: { body: { row } },
  index,
  scrollX,
// eslint-disable-next-line arrow-body-style
}: TDWrapperProps) => {
  return {
    style: {
      left: `${scrollX}px`,
      backgroundColor: `${index % 2 === 0 ? row.background.even : row.background.odd}`,
      height: `${row.height}`,
    },
  };
})`
${({
    pinned,
    // eslint-disable-next-line arrow-body-style
  }: TDWrapperProps) => {
    switch (pinned) {
      case true:
        return css`
        display: flex;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 1;
        box-shadow: 0px 0px 6px 2px rgb(0 0 0 / 40%);
        clip-path: inset(0px -15px 0px 0px);
        transition: box-shadow 0.5s ease;
      `;
      default:
        return css`
          display: flex;
          align-items: center;
      `;
    }
  }}
`;

function RowMemo<T extends Record<string, unknown>>({
  row,
  index,
  highLightedRows,
  styles,
  wrapperRef,
  className,
  pinnedColumns,
  setHighLightedRows,
}: Props<T>) {
  const pinnedRefs = useRef<HTMLDivElement[]>([]);

  const setPinnedRefs = (elm: HTMLDivElement | null) => {
    if (elm && pinnedColumns) {
      const colId = elm.getAttribute('data-col-id');
      if (colId && pinnedColumns.includes(colId)) {
        pinnedRefs.current.push(elm);
      }
    }
  };
  const onRowClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // console.log('e: ', e);
    // e.stopPropagation();
    const target = e.target as HTMLDivElement;
    const rowId = target.getAttribute('data-row-id') || null;
    if (rowId) {
      setHighLightedRows((state) => {
        if (state.includes(rowId)) {
          const newState = [...state];
          newState.splice(newState.findIndex((v) => v === rowId), 1);
          return newState;
        }
        return [...state, rowId];
      });
    }
  };

  const onScroll = useCallback(() => {
    pinnedRefs.current.forEach((element) => {
      element.style.left = `${wrapperRef.current?.scrollLeft}px`;
    });
  }, [wrapperRef]);

  useEffect(() => {
    const elm = wrapperRef.current;
    if (elm) {
      elm.addEventListener('scroll', onScroll);
    }
    return () => {
      if (elm) {
        elm.removeEventListener('scroll', onScroll);
      }
    };
  });

  const getCell = (row: Row<T>, cell: ColumnDefTemplate<CellContext<T, unknown>> | undefined) => {
    if (row.original.dummyRow) return '';
    return cell;
  };

  const isHighlighted = highLightedRows.includes(row.id.toString());
  return (
    <>
      <Tr
        key={row.id}
        data-row-id={row.id}
        className={`${classes.Tr} ${className || ''} ${isHighlighted ? classes.TRHighlighted : ''}`}
        onMouseUp={onRowClick}
        index={index}
        styles={styles}
      >
        {
          row.getVisibleCells().map((cell) => (
            <TdWrapper
              key={cell.id}
              data-col-id={cell.column.id}
              ref={setPinnedRefs}
              cell={cell}
              styles={styles}
              index={index}
              scrollX={wrapperRef.current?.scrollLeft || 0}
              pinned={pinnedColumns?.includes(cell.column.id) || false}
            >
              <Td
                  data-row-id={row.id}
                  className={classes.Td}
                  style={{
                    width: cell.column.getSize(),
                    textAlign: (cell.column.columnDef as ColumnDefCustom<T>).align,
                    ...(cell.column.columnDef as ColumnDefCustom<T>).style,
                  }}
                  styles={styles}
                >
                {flexRender(getCell(row, cell.column.columnDef.cell), cell.getContext())}
              </Td>
            </TdWrapper>
          ))
        }
      </Tr>
    </>
  );
}

export const TableRow = RowMemo;
