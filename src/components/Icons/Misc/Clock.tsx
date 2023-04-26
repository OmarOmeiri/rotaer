/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable require-jsdoc */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Misc.module.css';

interface ClockProps {
  size?: number,
  className?: string,
  buttonClassName?: string,
  buttonStyle?: React.CSSProperties,
  style?: React.CSSProperties,
  button?: boolean,
  title?: string,
  btnId?: string,
  fill?: string,
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const Clock: React.FC<ClockProps> = ({
  size = 24,
  buttonClassName,
  className,
  fill,
  title,
  buttonStyle,
  style,
  button,
  btnId,
  onClick,
}) => (

  <ConditionalWrapper
    condition={!!button}
    wrapper={(children) => (
      <button
        type="button"
        data-id={btnId}
        title={title}
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
    <div title={title}>
      <svg width={size} height={size} className={className} style={style} fill={fill || 'currentColor'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
        />
        <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
      </svg>
    </div>
  </ConditionalWrapper>
);

export default Clock;
