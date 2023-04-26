import {
  ColumnDef,
  Header,
  Column,
  CellContext,
  RowData,
  Table,
} from '@tanstack/react-table';
import React from 'react';
import type { TableStyles } from '../components/Table/styles';

declare module '@tanstack/react-table' {

  type CustomTable<TData extends RowData> = Omit<Table<TData>, 'options'> & {
    options: Omit<Table<TData>['options'], 'meta'> & {
      meta: {
        styles: TableStyles
      }
    }
  }

  type CustomCellContext<TData extends RowData, TValue> = {
    table: CustomTable<TData>;
  } & CellContext<TData, TValue>

  type CustomColumn<TData, TValue = unknown> = Column<TData, TValue> & {
    columnDef: ColumnDefCustom<TData, TValue>,
  }

  type _ColumnDefCustom<TData, TValue = unknown> = {
    draggable?: boolean,
    align?: React.CSSProperties['textAlign']
    stickable?: boolean,
    autoSize?: boolean,
    cell?: string | ((props: CustomCellContext<TData, TValue>) => any)
  }

  type ColumnDefCustom<TData, TValue = unknown> = DistributiveOmit<ColumnDef<TData, TValue>, 'cell'> & _ColumnDefCustom<TData, TValue>

  type HeaderCustom<TData extends RowData, TValue> = Header<TData, TValue> & {
    column: Column<TData, unknown> & {
      columnDef: ColumnDefCustom<TData, tValue>
    }
  }

  interface TableMeta {
    styles: TableStyles
  }
}
