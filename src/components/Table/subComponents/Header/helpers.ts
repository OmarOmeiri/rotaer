import type {
  ColumnResizeMode,
  ColumnSizingState,
  CustomColumn,
  Header,
  Table,
} from '@tanstack/react-table';
import React from 'react';
import classes from './Header.module.css';

const isTouchStartEvent = (e: unknown): e is TouchEvent => (
  (e as TouchEvent).type === 'touchstart'
);

const updateOffset = (
  table: Table<any>,
  eventType: 'move' | 'end',
  clientXPos?: number,
) => {
  if (typeof clientXPos !== 'number') {
    return;
  }

  const newColumnSizing: ColumnSizingState = {};

  table.setColumnSizingInfo((old) => {
    const deltaOffset = clientXPos - (old?.startOffset ?? 0);
    const deltaPercentage = Math.max(
      deltaOffset / (old?.startSize ?? 0),
      -0.999999,
    );

    old.columnSizingStart.forEach(([columnId, headerSize]) => {
      newColumnSizing[columnId] = Math.round(
        Math.max(headerSize + headerSize * deltaPercentage, 0) * 100,
      ) / 100;
    });

    return {
      ...old,
      deltaOffset,
      deltaPercentage,
    };
  });

  if (
    table.options.columnResizeMode === 'onChange'
    || eventType === 'end'
  ) {
    table.setColumnSizing((old) => ({
      ...old,
      ...newColumnSizing,
    }));
  }
};

export const onMove = (
  table: Table<any>,
  clientXPos?: number,
) => updateOffset(table, 'move', clientXPos);

export const onEnd = (
  table: Table<any>,
  clientXPos?: number,
) => {
  updateOffset(table, 'end', clientXPos);

  table.setColumnSizingInfo((old) => ({
    ...old,
    isResizingColumn: false,
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    columnSizingStart: [],
  }));
};

export const getHeaderResizerProps = <T extends Record<string, unknown>>({
  table,
  header,
  columnResizeMode,
}:{
  table: Table<T>,
  header: Header<T, unknown>,
  columnResizeMode: ColumnResizeMode
}): {
  onMouseDown: React.MouseEventHandler,
  onTouchStart: React.TouchEventHandler,
  style: React.CSSProperties,
  isResizing: boolean,
  className: string,
} => {
  const classNames = [classes.Resizer];

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMove(table, e.touches[0]?.clientX);
    return false;
  };

  const onTouchEnd = (e: TouchEvent) => {
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);

    e.preventDefault();
    e.stopPropagation();

    onEnd(table, e.touches[0]?.clientX);
  };

  const handler = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTouchStartEvent(e)) {
      document.addEventListener(
        'touchmove',
        onTouchMove,
      );
      document.addEventListener(
        'touchend',
        onTouchEnd,
      );
    }
    header.getResizeHandler()(e);
  };

  const style = columnResizeMode === 'onEnd'
  && header.column.getIsResizing()
    ? { transform: `translateX(${table.getState().columnSizingInfo.deltaOffset}px), ` }
    : {};

  return {
    onMouseDown: handler,
    onTouchStart: handler,
    style,
    isResizing: header.column.getIsResizing(),
    className: classNames.join(' '),
  };
};

export const getHeaderProps = <T extends Record<string, unknown>>(
  header: Header<T, unknown>,
  className?: string,
  sorting?: DBSorting<any>,
  pinned?: boolean,
  onSortingChange?: (e: React.MouseEvent | React.KeyboardEvent, col: CustomColumn<T>) => void,
) => {
  const cls = [classes.Th, className || ''];
  const sorted = (
    sorting?.find((s) => s.key === header.column.id) || { order: undefined }
  ).order;
  let onClick: React.MouseEventHandler | React.KeyboardEventHandler | undefined;

  if (header.column.getCanSort() && onSortingChange) {
    cls.push(classes.Sortable);
    onClick = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key !== 'Enter') return;
      e.stopPropagation();
      e.preventDefault();
      onSortingChange(e, header.column);
    };
  }

  if (sorted && sorted === 'asc') cls.push(classes.SortedAsc);
  if (sorted && sorted === 'desc') cls.push(classes.SortedDesc);
  if (pinned) cls.push(classes.ThSticky);
  if (header.id === 'row-select') cls.push(classes.RowSelectHeader);

  return {
    className: cls.join(' '),
    sorted,
    onClick,
  };
};

