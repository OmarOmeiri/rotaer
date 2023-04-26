import type { TableStyles } from '../components/Table/styles';
import { TableState } from '../components/Table/Table';

export const localStorageKeys = {
  tables: {
    stockScreener: 'stock-screener-table',
  },
};

export type LocalStorageTableState = {
  [k: string]: {
    name: string,
    query: DBQuery<any>
    styles?: DeepPartial<TableStyles>,
    state: TableState
  }
}

export type LocalStorageKeys =
| 'test'

export type LocalStorageTypes<T extends LocalStorageKeys> =
T extends 'test'
? LocalStorageTableState
: never
