/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable require-jsdoc */
import React, { Fragment } from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Order.module.css';

interface IDownProps {
  size?: number,
  className?: string,
  style?: React.CSSProperties,
  button?: boolean,
  onClick?: () => void
}

const DownSvg: React.FC<IDownProps> = ({
  size = 24,
  className,
  style,
  button,
  onClick,
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
      <svg width={size} height={size} version="1.1" viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-100.48 -169.53)">
          <path d="m102.35 178.6s8.0209 7.5963 8.6351 8.2105c0.61422 0.61421 1.0719 0.71145 1.4912 0.70871 0.36502 1e-3 0.86371-0.19406 1.2072-0.51372 0.61709-0.49049 8.4004-7.9282 8.7311-8.3298 0.42261-0.41413 0.50159-1.1878 0.29745-1.7146-0.28348-0.47247-0.67268-1.0005-1.4286-1.0242-0.75595-0.0236-17.111 0.0186-17.796 0.0186-0.23365 0-0.96266 0.20375-1.3761 1.0453-0.33072 0.94494 0.23847 1.5992 0.23847 1.5992z" fill="none" stroke="#000" strokeWidth="2.11" />
        </g>
      </svg>
    </>
  </ConditionalWrapper>
);

export default DownSvg;
