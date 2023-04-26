/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Fragment } from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Order.module.css';

interface ILeftProps {
  size?: number,
  className?: string,
  buttonClassName?: string,
  style?: React.CSSProperties,
  onClick?: (e: React.MouseEvent) => void,
  button?: boolean,
}

const LeftArrow: React.FC<ILeftProps> = ({
  size = 24,
  className,
  buttonClassName,
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
        className={`${classes.Btn} ${buttonClassName}`}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size} height={size} className={className} version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z" />
      </svg>
    </>
  </ConditionalWrapper>

);

export default LeftArrow;
