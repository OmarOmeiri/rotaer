import { round } from 'lullo-utils/Math';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  cashFormatPattern,
  deFormatCash,
  formatCash,
} from '@/utils/Number/numberUtils';
import Config from '../../config';
import { useDebounce } from '../../hooks/React/useDebounce';
import classes from './Slider.module.css';

type Props = {
  min: number,
  max: number,
  rangeColor?: string,
  name: string,
  value?: {min: number | null, max: number | null} | null,
  debounce?: number,
  onChange: RangeSliderEventHandler,
  classNames?: {
    container?: string,
    slider?: string,
    sliderTrack?: string,
    thumb?: string
  }
}

const styles = Config.get('styles').colors;

const MultiRangeSlider = ({
  min,
  max,
  name,
  value,
  debounce = 150,
  rangeColor = styles.green,
  classNames = {},
  onChange,
}: Props) => {
  const minValMemo = useMemo(
    () => Math.min(min, -1),
    [min],
  );
  const maxValMemo = useMemo(
    () => Math.max(max, 1),
    [max],
  );
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(0);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);
  const inputTarget = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const rng = maxValMemo
    - minValMemo;
    const stp = rng <= 10
      ? 0.1
      : 1;

    setStep(stp);
  }, [maxValMemo, minValMemo]);

  useEffect(() => {
    const rng = maxValMemo
    - minValMemo;
    const stp = rng <= 10
      ? 0.1
      : 1;

    if (typeof value?.min !== 'number') {
      if (stp >= 1) setMinVal(Math.floor(min));
      else setMinVal(Math.min(round(min, 1), -1));
    } else if (stp >= 1) {
      setMinVal(Math.floor(value.min));
    } else {
      setMinVal(round(value.min, 1));
    }

    if (typeof value?.max !== 'number') {
      if (stp >= 1) setMaxVal(Math.ceil(max));
      else setMaxVal(Math.max(round(max, 1), 1));
    } else if (stp >= 1) {
      setMaxVal(Math.ceil(value.max));
    } else setMaxVal(round(value.max, 1));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getPercent = useCallback((value: number) => (
    Math.round(((value - minValMemo) / (maxValMemo - minValMemo)) * 100)
  ), [minValMemo, maxValMemo]);

  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  useDebounce(() => {
    if (!inputTarget.current) return;
    const ev = new CustomEvent<_RangeSliderEvent>('range-slider', {
      detail: {
        min: minVal,
        max: maxVal,
      },
    }) as RangeSliderEvent;
    Object.defineProperty(ev, 'target', { writable: false, value: inputTarget.current });
    onChange(ev);
  }, [minVal, maxVal], debounce);

  const onValueClick = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key !== 'Enter') return;
    if (e.nativeEvent instanceof KeyboardEvent) {
      e.preventDefault();
      e.stopPropagation();
    }
    const target = e.target as HTMLDivElement;

    const input = target.querySelector('input') as HTMLInputElement | null;

    if (input) {
      const type = input.getAttribute('data-type');
      if (type) {
        const v = type === 'min'
          ? minVal
          : maxVal;
        input.setAttribute('data-value', String(v));
        const val = formatCash(
          v,
        ).toString();
        input.value = val;
        input.style.width = `${val.length + 1}ch`;
        input.classList.remove(classes.ValueInputHidden);
        input.focus();
      }
    }
  }, [minVal, maxVal]);

  const isInputValueValid = useCallback((value: string) => {
    if (value.match(cashFormatPattern) || !Number.isNaN(Number(value))) {
      return true;
    } return false;
  }, []);

  const onInputBlur = useCallback((e: React.FocusEvent) => {
    const { value } = e.target as HTMLInputElement;
    if (!isInputValueValid(value)) {
      e.target.classList.add(classes.ValueInputHidden);
      e.target.classList.remove(classes.InvalidValueInput);
      return;
    }
    const type = e.target.getAttribute('data-type');
    const fullVal = Number(e.target.getAttribute('data-value'));
    const fullValFmt = formatCash(fullVal).toString();
    const numValue = fullValFmt === value
      ? fullVal
      : deFormatCash(value);
    if (type === 'min') {
      const mn = Math.max(min, numValue);
      inputTarget.current = minValRef.current;
      setMinVal(mn);
    } else if (type === 'max') {
      const mx = Math.min(max, numValue);
      inputTarget.current = maxValRef.current;
      setMaxVal(mx);
    }
    e.target.classList.add(classes.ValueInputHidden);
  }, [max, min, isInputValueValid]);

  const onInputValueChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    if (isInputValueValid(value)) {
      e.target.classList.remove(classes.InvalidValueInput);
    } else e.target.classList.add(classes.InvalidValueInput);
    target.style.width = `${value.length + 1}ch`;
  }, [isInputValueValid]);

  const onEnterKey = useCallback((e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  }, []);

  const setValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.getAttribute('data-type') as 'min' | 'max';
    if (type === 'min') {
      inputTarget.current = minValRef.current;
      const value = step >= 1
        ? Math.floor(Math.min(+e.target.value, maxVal - 1))
        : Math.min(+e.target.value, maxVal - step);
      setMinVal(value);
      e.target.value = value.toString();
    } else {
      inputTarget.current = maxValRef.current;
      const value = step >= 1
        ? Math.ceil(Math.max(+e.target.value, minVal + 1))
        : Math.max(+e.target.value, minVal + step);

      setMaxVal(value);
      e.target.value = value.toString();
    }
  };

  const getMaxValLabel = useCallback(() => {
    if (step >= 1) return Math.abs(maxVal) > 1e5 ? String(formatCash(Math.ceil(maxVal))) : Math.ceil(maxVal);
    return maxVal;
  }, [maxVal, step]);

  const getMinValLabel = useCallback(() => {
    if (step >= 1) return Math.abs(minVal) > 1e5 ? String(formatCash(Math.floor(minVal))) : Math.floor(minVal);
    return minVal;
  }, [minVal, step]);

  return (
    <div className={`${classes.Container} ${classNames.container || ''}`}>
      <input
        type="range"
        min={Math.min(min, -1)}
        max={Math.max(max, 1)}
        data-name={name}
        data-type="min"
        step={step}
        value={minVal}
        ref={minValRef}
        onClick={onClick}
        onChange={setValues}
        className={`${classes.Thumb} ${minVal > max - 100 ? classes.ThumbZ5 : classes.ThumbZ3} ${classNames.thumb || ''}`}
      />
      <input
        type="range"
        min={Math.min(min, -1)}
        max={Math.max(max, 1)}
        data-name={name}
        data-type="max"
        step={step}
        value={maxVal}
        ref={maxValRef}
        onClick={onClick}
        onChange={setValues}
        className={`${classes.Thumb} ${classes.ThumbZ4} ${classNames.thumb || ''}`}
      />

      <div className={`${classes.Slider} ${classNames.slider || ''}`}>
        <div className={`${classes.SliderTrack} ${classNames.sliderTrack || ''}`}></div>
        <div ref={range} style={{ backgroundColor: rangeColor }} className={classes.SliderRange}></div>
        <div className={classes.SliderLeftValue} onClick={onValueClick} role="button" tabIndex={0} onKeyDown={onValueClick}>
          <>
            {
              getMinValLabel()
            }
            <input
              className={`${classes.ValueInput} ${classes.ValueInputHidden}`}
              data-type="min"
              onChange={onInputValueChange}
              onBlur={onInputBlur}
              onKeyDown={onEnterKey}
            />
          </>
        </div>
        <div className={classes.SliderRightValue} onClick={onValueClick} role="button" tabIndex={0} onKeyDown={onValueClick}>
          <>
            {
              getMaxValLabel()
            }
            <input
              className={`${classes.ValueInput} ${classes.ValueInputHidden}`}
              data-type="max"
              onChange={onInputValueChange}
              onBlur={onInputBlur}
              onKeyDown={onEnterKey}
            />
          </>
        </div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;

