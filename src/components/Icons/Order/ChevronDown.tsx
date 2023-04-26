/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Fragment } from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Order.module.css';

interface IChevronDownProps {
  size?: number,
  className?: string,
  fill?: string,
  style?: React.CSSProperties,
  onClick?: () => void
  button?: boolean
}

const ChevronDown: React.FC<IChevronDownProps> = ({
  size = 24,
  className,
  fill,
  style,
  onClick = () => {},
  button,
}) => (
  <ConditionalWrapper
    condition={!!button}
    wrapper={(children) => (
      <button
        type="button"
        style={{
          height: `${size}px`,
          width: `${size}px`,
          ...style,
        }}
        onClick={onClick}
        className={`${classes.Btn} ${className}`}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path fill={fill ?? 'currentColor'} d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
      </svg>
    </>
  </ConditionalWrapper>

);

// viewBox="0 0 448 512"

export default ChevronDown;
