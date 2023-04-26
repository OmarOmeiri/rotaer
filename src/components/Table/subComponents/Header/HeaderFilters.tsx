import { objHasProp } from 'lullo-utils/Objects';
import { useRef } from 'react';
import { PortalByRef } from '../../../../hoc/portal/PortalByRef';
import { TableStyles } from '../../styles';
import { TableHeadersRef } from '../../Table';
import { CategoricalFilterTooltip } from '../Tooltips/headers/CategoricalFilterTooltip';
import { NumericFilterTooltip } from '../Tooltips/headers/NumericFilterTooltip';
import { TextFilterTooltip } from '../Tooltips/headers/TextFilterTooltip';

const isNumericFilterValue = (value: unknown): value is NumericFilter['value'] => {
  if (value === null) return true;
  if (typeof value === 'object' && objHasProp(value, ['min', 'max'])) {
    return true;
  }
  return false;
};

const isTextFilterValue = (value: unknown): value is TextFilter['value'] => {
  if (value === null || typeof value === 'string') return true;
  return false;
};

type Props<T> = {
  columns: TableCols<T>[],
  filterValues: FilterValues<T>,
  isFiltered: ColumnsAppliedFilters<T>,
  headerRefs: React.MutableRefObject<TableHeadersRef>,
  styles?: DeepPartial<TableStyles>
  onFilter: (e: React.ChangeEvent<HTMLInputElement> | RangeSliderEvent | ListSelectEvent) => void,
}

const getControlWrapper = (elem: HTMLDivElement | null) => {
  if (!elem) return null;
  return elem.querySelector('.tbl-header-control');
};

export const HeaderFilters = <T, >({
  columns,
  headerRefs,
  filterValues,
  isFiltered,
  styles,
  onFilter,
}: Props<T>) => {
  const headerRef = useRef<{[K: string]: React.MutableRefObject<HTMLDivElement | null>}>({});
  return (
    <>
      {
          columns.map((c) => {
            const header = (headerRefs?.current || []).find((h) => h.id === c.key);
            if (!header) return null;
            const controlWrapper = getControlWrapper(header.element);
            if (!headerRef.current[c.key as string]) headerRef.current[c.key as string] = { current: null };
            headerRef.current[c.key as string].current = header.element;
            const value = filterValues[c.key];
            const applied = isFiltered[c.key];
            switch (c.type) {
              case 'text': {
                if (!isTextFilterValue(value)) return null;
                return (
                  <PortalByRef container={controlWrapper} key={`${c.key.toString()}-filter-tooltip`}>
                    <TextFilterTooltip
                      dataKey={c.key.toString()}
                      onChange={onFilter}
                      applied={applied}
                      value={value || ''}
                      ref={headerRef.current[c.key as string]}
                      iconStyle={styles?.header?.controlIcons}
                    />
                  </PortalByRef>
                );
              }
              case 'catg': {
                const uniqueVals = c.unique;
                if (!uniqueVals) return null;
                return (
                  <PortalByRef container={controlWrapper} key={`${c.key.toString()}-filter-tooltip`}>
                    <CategoricalFilterTooltip
                      ref={headerRef.current[c.key as string]}
                      values={uniqueVals}
                      applied={applied}
                      onChange={onFilter}
                      dataKey={c.key.toString()}
                      iconStyle={styles?.header?.controlIcons}
                    />
                  </PortalByRef>
                );
              }
              case 'number': {
                const numericStats = c.stats;
                if (!isNumericFilterValue(value) || !numericStats) return null;
                return (
                  <PortalByRef container={controlWrapper} key={`${c.key.toString()}-filter-tooltip`}>
                    <NumericFilterTooltip
                      dataKey={c.key.toString()}
                      name={c.name}
                      onChange={onFilter}
                      applied={applied}
                      min={numericStats.min}
                      max={numericStats.max}
                      bins={numericStats.bins}
                      value={value}
                      ref={headerRef.current[c.key as string]}
                      iconStyle={styles?.header?.controlIcons}
                    />
                  </PortalByRef>
                );
              }
              default:
                return null;
            }
          })
      }
    </>
  );
};
