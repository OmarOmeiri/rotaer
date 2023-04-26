/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { forwardRef } from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Order.module.css';

interface IChevronRightProps {
  size?: number,
  className?: string,
  buttonClassName?: string,
  style?: React.CSSProperties,
  onClick?: () => void
  button?: boolean,
}

const ChevronRight: React.ForwardRefRenderFunction<HTMLButtonElement, IChevronRightProps> = ({
  size = 24,
  className,
  buttonClassName,
  style,
  button,
  onClick = () => {},
}, ref?: React.ForwardedRef<HTMLButtonElement>) => (
  <ConditionalWrapper
    condition={!!button}
    wrapper={(children) => (
      <button
        type="button"
        ref={ref}
        style={{
          height: `${size}px`,
          width: `${size}px`,
          ...style,
        }}
        onClick={onClick}
        className={`${classes.Btn} ${buttonClassName}`}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size * 0.60666} className={className} height={size} version="1.1" viewBox="0 0 265.01 436.69" xmlns="http://www.w3.org/2000/svg">
        <path d="m257.98 235.31-194.34 194.34c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-0.04-33.901l154.02-154.75-154.02-154.74c-9.335-9.379-9.317-24.544 0.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0l194.34 194.34c9.373 9.372 9.373 24.568 1e-3 33.941z" fill="currentColor" />
      </svg>
    </>
  </ConditionalWrapper>
);

export default forwardRef(ChevronRight);
