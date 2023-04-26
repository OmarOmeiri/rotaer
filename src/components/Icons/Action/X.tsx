/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import iconClasses from './ActionIcons.module.css';
import classes from './X.module.css';

interface XIconProps{
  size?: number,
  btnId?: string,
  btnName?: string,
  buttonStyle?: React.CSSProperties,
  className?: string,
  button?: boolean,
  style?: React.CSSProperties,
  extraProps?: {[key: string]: string}
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const X: React.FC<XIconProps> = ({
  size = 13,
  className,
  buttonStyle,
  style,
  button,
  btnId,
  btnName,
  extraProps,
  onClick = () => {},
}) => (
  <ConditionalWrapper
    condition={!!button}
    wrapper={(children) => (
      <button
        type="button"
        data-id={btnId}
        data-name={btnName}
        style={{
          ...buttonStyle,
        }}
        onClick={onClick}
        className={`${iconClasses.Btn} ${className}`}
        {...extraProps}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg version="1.1" width={size} height={size} className={classes.X} style={style} viewBox="0 0 13.931 13.931" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-49.903 -165.18)" fill="none" strokeLinecap="round" strokeWidth="3.165">
          <path d="m49.903 165.18c0.08585 0.32039 13.973 13.973 13.973 13.973" />
          <path d="m49.903 179.09 13.902-13.902" />
        </g>
      </svg>
    </>
  </ConditionalWrapper>
);

export default X;
