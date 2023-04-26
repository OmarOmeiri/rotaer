import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { TableStyles } from '../../components/Table/styles';
import { TableState } from '../../components/Table/Table';
import { LocalStorageKeys } from '../../config/localStorage';
import { useLocalStorage } from '../useLocalStorage';

export const useTableStyles = ({
  styles,
  localStorageKey,
  selectedColPreset,
  initialTableState,
}:{
  styles?: DeepPartial<TableStyles>,
  localStorageKey?: LocalStorageKeys,
  selectedColPreset?: string | null,
  initialTableState?: {
    query: DBQuery<any>,
    styles?: DeepPartial<TableStyles>,
    state: TableState
  } | null
}) => {
  const {
    getLocalStorage,
  } = useLocalStorage();

  const [tableStyles, setTableStyles] = useState<DeepPartial<TableStyles>>(initialTableState?.styles || styles || {});

  const tableStateStorage = useMemo(() => {
    if (localStorageKey && selectedColPreset) return getLocalStorage(localStorageKey)?.[selectedColPreset];
    return null;
  }, [localStorageKey, getLocalStorage, selectedColPreset]);

  useEffect(() => {
    if (tableStateStorage) {
      setTableStyles((st) => ({
        ...st,
        ...(tableStateStorage.styles || {}),
      }));
    } else {
      setTableStyles({});
    }
  }, [localStorageKey, selectedColPreset, tableStateStorage]);

  const onTableFontSizeChange = useCallback((type: '+' | '-') => {
    const maxFontSize = 1.6;
    const increment = type === '+'
      ? 0.05
      : -0.05;

    setTableStyles((state) => {
      const num = Number(
        (state.body?.fontSize || '1')
          .replace(/[^\d.]/g, ''),
      ) + increment;
      const size = Math.min(
        num,
        maxFontSize,
      ).toFixed(2);
      return {
        ...state,
        body: {
          ...state.body,
          fontSize: `${size}rem`,
        },
      };
    });
  }, []);

  return {
    tableStyles,
    setTableStyles,
    onTableFontSizeChange,
  };
};
