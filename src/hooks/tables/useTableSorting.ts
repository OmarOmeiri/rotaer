import type { CustomColumn } from '@tanstack/react-table';
import { useCallback, useState } from 'react';

type SortOrder = 'asc' | 'desc'| undefined;

export const useTableSorting = <
  K extends string,
  S extends DBSorting<K>
>(
    initialState: S,
  ) => {
  const [sorting, setSorting] = useState(initialState);

  const getSortOrder = useCallback((order?: 'asc' | 'desc') => {
    switch (order) {
      case 'asc':
        return 'desc';
      case 'desc':
        return;
      case undefined:
      default:
        return 'asc';
    }
  }, []);

  const handleSingleSort = useCallback(<T extends CustomColumn<any>>(
    col: T,
    sortOrder: SortOrder,
  ): S => {
    if (!sortOrder) {
      return [] as unknown as S;
    }
    return [{
      key: col.id,
      order: sortOrder,
    }] as S;
  }, []);

  const handleMultiSort = useCallback(<T extends CustomColumn<any>>(
    newState: S,
    col: T,
    sortOrder: SortOrder,
    ix: number,
    found: boolean,
  ): S => {
    if (!sortOrder && found) {
      newState.splice(ix, 1);
      return newState;
    }

    if (!sortOrder) return newState;

    if (found) {
      newState[ix] = {
        ...newState[ix],
        order: sortOrder,
      };
      return newState as S;
    }
    return [
      ...newState,
      {
        key: col.id,
        order: sortOrder,
      },
    ] as S;
  }, []);

  const onSort = useCallback(<T extends CustomColumn<any>>(e: React.MouseEvent | React.KeyboardEvent, col: T) => {
    const isMulti = e.shiftKey;
    setSorting((state) => {
      const newState = [...state] as S;
      const ix = newState.findIndex((s) => s.key === col.id);
      const found = ix > -1;
      const sortOrder = found
        ? getSortOrder(newState[ix].order)
        : getSortOrder(undefined);

      if (!isMulti) {
        return handleSingleSort(
          col,
          sortOrder,
        );
      }

      return handleMultiSort(
        newState,
        col,
        sortOrder,
        ix,
        found,
      );
    });
  }, [getSortOrder, handleSingleSort, handleMultiSort]);

  return {
    sorting,
    setSorting,
    onSort,
  };
};
