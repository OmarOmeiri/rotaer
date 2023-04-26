import { ErrorCodes } from 'lullo-common-types';
import { sortObjArrayByArrayAndKey } from 'lullo-utils/Arrays';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { TableStyles } from '@/components/Table/styles';
import { TableState } from '@/components/Table/Table';
import { LocalStorageKeys } from '@/config/localStorage';
import errorHelper from '@/utils/Errors/errorHelper';
import { useLocalStorage } from '../useLocalStorage';

export const useColumns = <
  K extends PropertyKey,
  T extends Record<K, unknown>,
>({
    columns,
    columnPresets,
    columnPin,
    localStorageTableKey,
    defaultColumnPresetName,
    defaultColumnPreset,
    initialTableState,
  }: {
  columnPresets: TableColumnPresets,
  columns: TableCols<T>[],
  columnPin?: K[]
  defaultColumnPresetName: string,
  defaultColumnPreset: K[],
  localStorageTableKey?: LocalStorageKeys,
  initialTableState?: {
    query: DBQuery<any>,
    styles?: DeepPartial<TableStyles>,
    state: TableState
  } | null
}) => {
  const {
    getLocalStorage,
  } = useLocalStorage();
  const [pinnedColumns, setPinnedColumns] = useState(columnPin || []);
  const [selectedColPreset, setSelectedColPreset] = useState<string | null>(
    initialTableState
      ? null
      : defaultColumnPresetName,
  );

  const [userSavedTables, setUserSavedTables] = useState(
    localStorageTableKey
      ? getLocalStorage(localStorageTableKey) || {}
      : {},
  );

  const tableColumnPresets = useMemo(() => {
    const userPresets = Object.fromEntries(
      Object.entries(
        userSavedTables,
      ).map(([k, v]) => ([
        k,
        { name: v.name, preset: v.query },
      ])),
    );
    return {
      ...columnPresets,
      ...userPresets,
    } as TableColumnPresets;
  }, [userSavedTables, columnPresets]);

  const columnPresetList = useMemo(() => (
    Object.entries(tableColumnPresets).reduce((presets, [k, val]) => ([
      ...presets,
      { name: val.name, key: k, deletable: !(k in columnPresets) },
    ]), [] as {key: string, name: string, deletable?: boolean}[])
  ), [tableColumnPresets, columnPresets]);

  const [selectedColumnList, setSelectedColumnList] = useState<K[]>(() => {
    if (initialTableState) return initialTableState.query.select;
    if (selectedColPreset && selectedColPreset in tableColumnPresets) {
      return tableColumnPresets[selectedColPreset].preset.select;
    }
    return defaultColumnPreset;
  });

  const selectedColumns = useMemo(() => {
    if (columns.length) {
      const selCols = columns.filter((c) => (
        selectedColumnList as string[]
      ).includes(c.key.toString())) as TableCols<T>[];
      return sortObjArrayByArrayAndKey(
        selCols,
        selectedColumnList,
        'key',
      );
    }
    return [];
  }, [selectedColumnList, columns]);

  const onColumnPresetChange = useCallback((k: string) => {
    const key = k as keyof typeof tableColumnPresets;
    if (k === selectedColPreset) return;
    if (key in tableColumnPresets) {
      setSelectedColPreset(key.toString());
    }
  }, [setSelectedColPreset, selectedColPreset, tableColumnPresets]);

  const onColumnPin = useCallback((id: string) => {
    setPinnedColumns((state) => {
      const newState = [...state];
      const ix = state.findIndex((s) => s === id);
      if (ix > -1) newState.splice(ix, 1);
      else newState.push(id as K);
      return newState;
    });
  }, []);

  const onColumnAddOrRemove = useCallback((e: ListSelectEvent) => {
    const clickedColumnId = e.target.getAttribute('data-id');
    if (clickedColumnId) {
      const newState = [...selectedColumnList];
      const ix = newState.findIndex((c) => c === clickedColumnId);
      if (ix > -1) {
        newState.splice(ix, 1);
      } else {
        newState.splice(2, 0, clickedColumnId as K);
      }
      setSelectedColumnList(newState);
    } else {
      errorHelper({
        message: 'Houve um erro ao selecionar a coluna',
        code: ErrorCodes.htmlAttrError,
        stack: new Error().stack,
      });
    }
  }, [selectedColumnList, setSelectedColumnList]);

  return {
    pinnedColumns,
    selectedColumnList,
    selectedColumns,
    columnPresetList,
    tableColumnPresets,
    selectedColPreset,
    setUserSavedTables,
    onColumnPresetChange,
    onColumnAddOrRemove,
    onColumnPin,
    setPinnedColumns,
    setSelectedColumnList,
    setSelectedColPreset,
  };
};

