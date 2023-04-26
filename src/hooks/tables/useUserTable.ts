import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { shallow } from 'zustand/shallow';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TableStyles } from '../../components/Table/styles';
import {
  TableRef,
  TableState,
} from '../../components/Table/Table';
import {
  LocalStorageKeys,
  LocalStorageTableState,
} from '../../config/localStorage';
import modalStore from '../../store/modal/modalStore';

const useUserTable = ({
  localStorageTableKey,
  tableRef,
  columns,
  sorting,
  filters,
  styles,
  selectedColPreset,
  setUserSavedTables,
  onReloadUserSavedTable,
  onTableStateChange,
}:{
  localStorageTableKey: LocalStorageKeys,
  tableRef: React.MutableRefObject<TableRef | null>,
  columns: string[]
  sorting?: DBSorting<string>,
  filters?: {
    [x: string]: AllFilterTypes | undefined;
  }
  selectedColPreset?: string | null,
  styles?: DeepPartial<TableStyles>
  initialState?: {
    query: DBQuery<any>,
    styles?: DeepPartial<TableStyles>,
    state: TableState,
  }
  setUserSavedTables: SetState<LocalStorageTableState>
  onReloadUserSavedTable?: (name?: string) => void,
  onTableStateChange?: (state: {
    query: DBQuery<any>,
    styles?: DeepPartial<TableStyles>,
    state: TableState,
  }) => void
}) => {
  const [tableState, setTableState] = useState<Partial<TableState>>({});
  const { setModalContent, setShowModal } = modalStore((state) => ({
    setShowModal: state.setShowModal,
    setModalContent: state.setModalContent,
  }), shallow);

  const {
    getLocalStorage,
  } = useLocalStorage();

  const tableStateStorage = useMemo(() => {
    if (localStorageTableKey && selectedColPreset) return getLocalStorage(localStorageTableKey)?.[selectedColPreset];
    return null;
  }, [localStorageTableKey, getLocalStorage, selectedColPreset]);

  useEffect(() => {
    if (onTableStateChange && tableRef.current) {
      onTableStateChange({
        query: {
          select: columns,
          orderBy: sorting,
          filters,
        },
        styles,
        state: tableRef.current.getState(),
      });
    }
  }, [
    onTableStateChange,
    columns,
    filters,
    sorting,
    styles,
    tableRef,
  ]);

  useEffect(() => {
    if (tableStateStorage) {
      setTableState((st) => ({
        ...st,
        ...(tableStateStorage.state || {}),
      }));
    } else {
      setTableState({});
    }
  }, [tableStateStorage]);

  const reloadUserSavedTables = useCallback((name?: string) => {
    setUserSavedTables(getLocalStorage(localStorageTableKey) || {});
    if (onReloadUserSavedTable) onReloadUserSavedTable(name);
  }, [
    setUserSavedTables,
    getLocalStorage,
    onReloadUserSavedTable,
    localStorageTableKey,
  ]);

  const onTableSave = useCallback(() => {
    if (tableRef.current) {
      setModalContent({
        name: 'saveTableColumns',
        propsToChildren: {
          storageKey: localStorageTableKey,
          query: {
            select: columns,
            orderBy: sorting,
            filters,
          },
          styles,
          state: tableRef.current.getState(),
          onSave: (name: string) => {
            reloadUserSavedTables(name);
          },
        },
      });
      setShowModal(true);
    }
  }, [
    setModalContent,
    setShowModal,
    reloadUserSavedTables,
    localStorageTableKey,
    columns,
    filters,
    sorting,
    styles,
    tableRef,
  ]);

  const onTableDelete = useCallback((name: string) => {
    setModalContent({
      name: 'deleteTableColumns',
      propsToChildren: {
        storageKey: localStorageTableKey,
        name,
        onDelete: () => {
          reloadUserSavedTables();
        },
      },
    });
    setShowModal(true);
  }, [
    localStorageTableKey,
    setModalContent,
    setShowModal,
    reloadUserSavedTables,
  ]);

  return {
    onTableSave,
    onTableDelete,
    tableState,
  };
};

export default useUserTable;
