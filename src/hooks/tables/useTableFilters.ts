import { ErrorCodes } from 'lullo-common-types';
import { objHasProp } from 'lullo-utils/Objects';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { ClientError } from '../../utils/Errors/ClientError';

const isNumericFilter = <T extends TableFilters<Record<string, unknown>>>(
  value: unknown,
  name: string,
  filters: TableFilters<T>,
): value is NumericFilter['value'] => {
  if (filters[name].type !== 'number') return false;
  if (typeof value !== 'object' || value === null) return false;
  if (!objHasProp(value, ['min', 'max'])) return false;
  if (typeof value.max !== 'number' || typeof value.min !== 'number') return false;
  return true;
};

const isTextFilter = <T extends TableFilters<Record<string, unknown>>>(
  value: unknown,
  name: string,
  filters: TableFilters<T>,
): value is TextFilter['value'] => {
  if (filters[name].type !== 'text') return false;
  if (typeof value !== 'string') return false;
  return true;
};

const isCatgFilter = <T extends TableFilters<Record<string, unknown>>>(
  value: unknown,
  name: string,
  filters: TableFilters<T>,
): value is CategoricalFilter['value'] => {
  if (filters[name].type !== 'catg') return false;
  if (!Array.isArray(value)) return false;
  return true;
};

const isListSelectEvent = (e: unknown): e is ListSelectEvent => {
  if (!(e instanceof CustomEvent)) return false;
  const { detail } = e;
  if (
    objHasProp(detail, ['selected'])
    && Array.isArray(detail.selected)
  ) return true;
  return false;
};

const isRangeSliderEvent = (e: unknown): e is RangeSliderEvent => {
  if (!(e instanceof CustomEvent)) return false;
  const { detail } = e;
  if (
    objHasProp(detail, ['min', 'max'])
    && typeof detail.max === 'number'
    && typeof detail.min === 'number'
  ) return true;
  return false;
};

const _isFiltered = <T extends {[K: string]: TableColTypes }>(
  filters: TableFilters<T>,
  selectedColumns: TableCols<T>[],
) => (Object.entries(filters) as Entries<typeof filters>)
    .reduce((obj, [k, v]) => {
      const { type } = filters[k];
      const { value } = v;
      if (type === 'text') {
        return { ...obj, [k]: !!value };
      }
      if (type === 'number') {
        const numVal = value as NumericFilter['value'];
        const col = selectedColumns.find((c) => c.key === k);
        if (!numVal || !col?.stats) return { ...obj, [k]: false };
        if (!numVal.min && !numVal.max) return { ...obj, [k]: false };
        const minNotApplied = numVal.min === null || numVal.min <= col.stats.min;
        const maxNotApplied = numVal.max === null || numVal.max >= col.stats.max;
        if (minNotApplied && maxNotApplied) return { ...obj, [k]: false };
        return { ...obj, [k]: true };
      }
      if (type === 'catg') {
        const isArray = Array.isArray(value);
        if (isArray && value.length) {
          return { ...obj, [k]: true };
        }
        return { ...obj, [k]: false };
      }
      return obj;
    }, {} as ColumnsAppliedFilters<T>);

/* eslint-disable require-jsdoc */
export function useTableFilters<T extends {[K: string]: TableColTypes }>({
  initialFilters,
  columnTypes,
  selectedColumns,
}:{
  initialFilters?: TableFilters<T>,
  columnTypes: T,
  selectedColumns: TableCols<T>[],
}): {
  filters: TableFilters<T>,
  nonNullFilter: TableFilters<T> | undefined,
  getFilterValues: () => FilterValues<T>
  setFilter: TableFiltersEventHandler,
  isFiltered: () => ColumnsAppliedFilters<T>,
  resetFilters: (filters?: TableFilters<T>) => void
} {
  const initTableFilters = useMemo(() => {
    if (initialFilters) return initialFilters;
    return (
      Object
        .entries(columnTypes)
        .reduce((obj, [k, v]) => ({
          ...obj,
          [k]: {
            type: v,
            value: null,
          },
        }), {} as TableFilters<T>)
    );
  }, [columnTypes, initialFilters]);

  const [filters, setFilters] = useState<TableFilters<T>>(initTableFilters);

  useEffect(() => {
    setFilters(initTableFilters);
  }, [initTableFilters]);

  const _setFilters = useCallback((name: string, value: AllFilterValueTypes) => {
    setFilters((state) => ({
      ...state,
      [name]: {
        ...state[name],
        value,
      },
    }));
  }, [setFilters]);

  const setNumericFilter = useCallback((name: string, value: NumericFilter['value']) => {
    if (!isNumericFilter(value, name, filters)) {
      throw new ClientError('Houve um erro ao filtrar', {
        code: ErrorCodes.htmlAttrError,
        data: {
          reason: 'Numeric filter is malformatted',
          name,
          filterNames: Object.keys(filters),
        },
        stack: undefined,
      });
    }
    _setFilters(name, value);
  }, [_setFilters, filters]);

  const setTextFilter = useCallback((name: string, value: TextFilter['value']) => {
    if (!isTextFilter(value, name, filters)) {
      throw new ClientError('Houve um erro ao filtrar', {
        code: ErrorCodes.htmlAttrError,
        data: {
          reason: 'Text filter is malformatted',
          name,
          expected: 'string',
          received: typeof value,
        },
        stack: undefined,
      });
    }
    _setFilters(name, value);
  }, [_setFilters, filters]);

  const setCatgFilter = useCallback((name: string, value: CategoricalFilter['value']) => {
    if (!isCatgFilter(value, name, filters)) {
      throw new ClientError('Houve um erro ao filtrar', {
        code: ErrorCodes.htmlAttrError,
        data: {
          reason: 'Categorical filter is malformatted',
          name,
          expected: 'array',
          received: typeof value,
        },
        stack: undefined,
      });
    }
    _setFilters(name, value);
  }, [_setFilters, filters]);

  const setFilter: TableFiltersEventHandler = useCallback((e) => {
    const target = e.target as HTMLInputElement;
    const name = target.getAttribute('data-name') as string;
    if (!(name in filters)) {
      throw new ClientError('Houve um erro ao filtrar', {
        code: ErrorCodes.htmlAttrError,
        data: {
          reason: 'Name not found in filters',
          name,
          filterNames: Object.keys(filters),
        },
        stack: undefined,
      });
    }

    if (isRangeSliderEvent(e)) {
      setNumericFilter(name, { min: e.detail.min, max: e.detail.max });
      return;
    }

    if (isListSelectEvent(e)) {
      setCatgFilter(name, e.detail.selected);
      return;
    }

    setTextFilter(name, e.target.value);
  }, [filters, setCatgFilter, setNumericFilter, setTextFilter]);

  const getFilterValues = useCallback(() => (
    Object.entries(filters)
      .reduce((obj, [k, v]) => ({
        ...obj,
        [k]: v.value,
      }), {} as FilterValues<T>)
  ), [filters]);

  const isFiltered = useCallback(() => (
    _isFiltered(filters, selectedColumns)
  ), [filters, selectedColumns]);

  const resetFilters = useCallback((filters?: TableFilters<T>) => {
    setFilters(filters || initTableFilters);
  }, [initTableFilters]);

  const nonNullFilter = useMemo(() => {
    const filteredColumns = _isFiltered(filters, selectedColumns);
    const filtered = Object.fromEntries(
      Object.entries(filters)
        .filter((([k, f]) => f.value && filteredColumns[k as keyof typeof filteredColumns])),
    ) as TableFilters<T>;
    if (Object.keys(filtered).length) return filtered;
    return undefined;
  }, [filters, selectedColumns]);

  return {
    filters,
    nonNullFilter,
    getFilterValues,
    setFilter,
    isFiltered,
    resetFilters,
  };
}

