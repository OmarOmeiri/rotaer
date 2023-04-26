/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable require-jsdoc */
import React, { Fragment } from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Status.module.scss';

interface BrokenFileProps {
  size?: number,
  className?: string,
  buttonClassName?: string,
  buttonStyle?: React.CSSProperties,
  style?: React.CSSProperties,
  button?: boolean,
  btnId?: string,
  fill?: string,
  title?: string,
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | undefined
}

const BrokenFile: React.FC<BrokenFileProps> = ({
  size = 24,
  buttonClassName,
  className,
  fill,
  buttonStyle,
  style,
  button,
  title,
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
    <>
      <svg width={size} height={size} className={className} style={style} fill={fill || 'currentColor'} xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 128 128" xmlSpace="preserve">
        <path d="M114.9,28.9L89.2,3.1c-0.9-0.9-2-1.4-3.3-1.4H20c-4.6,0-8.3,3.7-8.3,8.3v46.8v11.7l9.3-6.4l4.9-3.4l30.5,21.5l33.5-14.4    l17.3,7.2l9.3,3.9V66.5V32.2C116.3,31,115.8,29.8,114.9,28.9z M107.1,62.6l-17.3-7.2L57.5,69.3L25.9,47l-5,3.5V11h60.3v17.5    c0,4.6,3.7,8.3,8.3,8.3h17.5V62.6z" />
        <path d="M89.8,78L55.7,92.7L25.8,71.6L20.9,75l-9.3,6.4v11.7v24.7c0,4.6,3.7,8.3,8.3,8.3h88c4.6,0,8.3-3.7,8.3-8.3V99.5V89.1    l-9.3-3.9L89.8,78z M107.1,117H20.9V86.7l4.9-3.4l28.8,20.3l35.3-15.2l17.2,7.2V117z" />
      </svg>
    </>
  </ConditionalWrapper>
);

export default BrokenFile;
