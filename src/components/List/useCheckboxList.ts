import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useFirstRender } from '../../hooks/React/useFirstRender';

type Props = {
  initChecked?: Array<string>;
  values: Array<string | boolean> | Array<{value: string | JSX.Element, id: string, disabled?: boolean}>,
  onChange: ListSelectEventHandler,
}

const isValueWithId = (value: unknown): value is Array<{value: string | JSX.Element, id: string, disabled?: boolean}> => {
  if (!Array.isArray(value)) return false;
  if (value.some((v) => typeof v === 'string')) return false;
  return true;
};

export const useCheckboxList = ({
  initChecked,
  values,
  onChange,
}: Props) => {
  const isFirstRender = useFirstRender();
  const selectTarget = useRef<HTMLDivElement | null>(null);
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    if (initChecked && isFirstRender) {
      const init = initChecked
        .reduce((ixs, val) => {
          let found = -1;
          if (isValueWithId(values)) {
            found = values.map((v) => v.id).indexOf(val);
          } else {
            found = values.indexOf(val);
          }
          if (found > -1) return [...ixs, found];
          return ixs;
        }, [] as number[]);
      setChecked(init);
    }
  }, [initChecked, isFirstRender, values]);

  useEffect(() => {
    if (isFirstRender || !selectTarget.current) return;
    const ev = new CustomEvent<_ListSelectEvent>('list-select', {
      detail: {
        selected: isValueWithId(values)
          ? checked.map((c) => values[c].id)
          : checked.map((c) => values[c]),
      },
    }) as ListSelectEvent;
    Object.defineProperty(ev, 'target', { writable: false, value: selectTarget.current });
    onChange(ev);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLDivElement;
    const value = Number(target.getAttribute('data-index') || NaN);
    if (Number.isNaN(value)) return;
    selectTarget.current = target;
    setChecked((state) => {
      const currentIndex = state.indexOf(value);
      if (currentIndex === -1) {
        return [...state, value];
      }
      const newState = [...state];
      newState.splice(currentIndex, 1);
      return newState;
    });
  }, []);

  return {
    checked,
    handleToggle,
  };
};
