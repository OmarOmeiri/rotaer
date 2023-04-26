/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Order.module.css';

interface IChevronLeftProps {
  size?: number,
  className?: string,
  buttonClassName?: string,
  buttonStyle?: React.CSSProperties,
  style?: React.CSSProperties,
  onClick?: () => void,
  button?: boolean,
}

const ChevronLeft: React.ForwardRefRenderFunction<HTMLButtonElement, IChevronLeftProps> = ({
  size = 24,
  buttonClassName,
  buttonStyle,
  className,
  style,
  button,
  onClick = () => {},
}, ref: React.ForwardedRef<HTMLButtonElement>) => (
  <ConditionalWrapper
    condition={!!button}
    wrapper={(children) => (
      <button
        type="button"
        ref={ref}
        style={{
          height: `${size}px`,
          width: `${size}px`,
          ...buttonStyle,
        }}
        onClick={onClick}
        className={`${classes.Btn} ${buttonClassName}`}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size * 0.60666} height={size} className={className} style={style} version="1.1" viewBox="0 0 265.02 436.68" xmlns="http://www.w3.org/2000/svg">
        <path d="m7.0275 201.37 194.35-194.34c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52 0.04 33.9l-154.03 154.74 154.02 154.75c9.34 9.38 9.32 24.54-0.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0l-194.34-194.35c-9.37-9.37-9.37-24.57 0-33.94z" fill="currentColor" />
      </svg>
    </>
  </ConditionalWrapper>
);

export default React.forwardRef(ChevronLeft);
