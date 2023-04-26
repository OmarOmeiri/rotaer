/* eslint-disable require-jsdoc */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import type {
  ColumnResizeMode,
  CustomColumn,
  Header, HeaderCustom, Table,
} from '@tanstack/react-table';
import type { Over } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableHeader } from './Header';
import { TableStyles } from '../../styles';

type Props<T extends Record<string, unknown>> = {
  header: Header<T, unknown>,
  columnResizeMode: ColumnResizeMode
  table: Table<T>
  sorting?: DBSorting<any>,
  styles: TableStyles
  pinned?: boolean,
  tooltip?: JSX.Element
  onOver: (over: Over | null) => void,
  onColumnPin?: (id: string) => void
  onSortingChange?: (e: React.MouseEvent | React.KeyboardEvent, col: CustomColumn<T>) => void,
}

declare module 'react' {
  function forwardRef<T, P = object>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

function DraggableTableHeaderFwdRef<T extends Record<string, unknown>>({
  table,
  header,
  columnResizeMode,
  sorting,
  styles,
  pinned,
  tooltip,
  onColumnPin,
  onOver,
  onSortingChange,
}: Props<T>, ref: React.ForwardedRef<HTMLDivElement>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    over,
    node,
  } = useSortable({ id: header.id });
  useImperativeHandle(ref, () => node.current as HTMLDivElement);

  useEffect(() => {
    onOver(over);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over?.id, onOver]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableHeader
      table={table}
      columnResizeMode={columnResizeMode}
      header={header as HeaderCustom<T, unknown>}
      ref={setNodeRef}
      onColumnPin={onColumnPin}
      sorting={sorting}
      tooltip={tooltip}
      pinned={pinned}
      style={style}
      styles={styles}
      attributes={attributes}
      listeners={listeners}
      onSortingChange={onSortingChange}
    />
  );
}

export const DraggableTableHeader = forwardRef(DraggableTableHeaderFwdRef);
