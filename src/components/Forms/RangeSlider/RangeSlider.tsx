import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import classes from './RangeSlider.module.css';

export interface IRangeSliderProps {
  multi?: boolean,
  max?: number,
  maxValInit?: number,
  min?: number,
  minValInit?: number,
  step?: number,
  wrapperStyle?: React.CSSProperties,
  rightTextPosition?: number,
  onChange?: (e: {min: number, max: number}) => void
}

const RangeSlider: React.FC<IRangeSliderProps> = ({
  multi = false,
  max = 100,
  maxValInit,
  min = 0,
  minValInit,
  step = 1,
  wrapperStyle,
  rightTextPosition,
  onChange = () => {},
}) => {
  const [minVal, setMinVal] = useState(minValInit ?? min);
  const [maxVal, setMaxVal] = useState(maxValInit ?? max);
  const range = useRef<null | HTMLDivElement>(null);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);

  const getPercent = useCallback((value: number) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

  // Set width of the range to change from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to change from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  const style = {
    height: '35px',
    width: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: multi ? '0 25px' : '0 25px 0 12px',
    ...wrapperStyle,
  };

  const top = Number(String(style.height).replace('px', '')) / 2;
  const width = Number(String(style.width).replace('px', ''));

  return (
    <div style={style}>
      {
        multi === true
          ? (
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={minVal}
              className={`${classes.Thumb} ${classes.ThumbLeft} `}
              onChange={(event) => {
                const value = Math.min(Number(event.target.value), maxVal - 1);
                setMinVal(value);
                minValRef.current = value;
                onChange({ min: value, max: maxValRef.current });
              }}
              style={{ zIndex: 5, top, width }}
            />
          )
          : null
      }
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(event) => {
          const value = multi ? Math.max(Number(event.target.value), minVal + 1) : Number(event.target.value);
          setMaxVal(value);
          maxValRef.current = value;
          onChange({ min: value, max: maxValRef.current });
        }}
        className={`${classes.Thumb} ${classes.ThumbRight}`}
        style={{ top, width }}
      />

      <div className={classes.Slider} style={{ width }}>
        <div className={classes.SliderTrack} />
        <div ref={range} className={classes.SliderRange} />
        {
          multi === true
            ? <div className={classes.SliderLeftValue}>{minVal}</div>
            : null
        }
        <div
          style={
            rightTextPosition
              ? { right: `${rightTextPosition}px` }
              : undefined
          }
          className={classes.SliderRightValue}
        >
          {maxVal}
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
