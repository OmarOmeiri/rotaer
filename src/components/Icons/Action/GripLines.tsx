/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './ActionIcons.module.css';

interface GripLinesIconProps{
  size?: number,
  buttonStyle?: React.CSSProperties,
  className?: string,
  buttonClassName?: string,
  button?: boolean,
  style?: React.CSSProperties,
  btnId?: string,
  fill?: string,
  onClick?: (e: React.MouseEvent) => void
}

const GripLines: React.FC<GripLinesIconProps> = ({
  size = 13,
  className,
  buttonClassName,
  buttonStyle,
  style,
  button,
  btnId,
  fill,
  onClick = () => {},
}) => (
  <ConditionalWrapper
    condition={!!button}
    wrapper={(children) => (
      <button
        style={{
          ...buttonStyle,
        }}
        data-id={btnId}
        onClick={onClick}
        className={`${classes.Btn} ${buttonClassName}`}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size} height={size * 0.375} className={`${className}`} style={style} version="1.1" viewBox="0 0 512 192" xmlns="http://www.w3.org/2000/svg">
        <path fill={fill ?? 'currentColor'} d="m496 128h-480c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-128h-480c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z" />
      </svg>
    </>
  </ConditionalWrapper>
);

export default GripLines;
