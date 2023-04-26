/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable require-jsdoc */
import React, { Fragment } from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Status.module.scss';

interface BrokenImgProps {
  size?: number,
  className?: string,
  buttonClassName?: string,
  buttonStyle?: React.CSSProperties,
  style?: React.CSSProperties,
  button?: boolean,
  btnId?: string,
  fill?: string,
  title?: string,
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const BrokenImg: React.FC<BrokenImgProps> = ({
  size = 24,
  buttonClassName,
  className,
  fill,
  buttonStyle,
  title,
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
        style={{
          height: `${size}px`,
          width: `${size}px`,
          ...buttonStyle,
        }}
        title={title}
        onClick={onClick}
        className={`${classes.Btn} ${buttonClassName}`}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size} height={size} className={className} style={style} fill={fill || 'currentColor'} xmlns="http://www.w3.org/2000/svg" data-name="Layer 2" viewBox="0 0 32 32" x="0px" y="0px">
        <path d="M14,27a1,1,0,0,1-.707-1.707L16.586,22l-3.293-3.293a1,1,0,0,1,0-1.414L16.586,14l-3.293-3.293a1,1,0,0,1,0-1.414l4-4a1,1,0,1,1,1.414,1.414L15.414,10l3.293,3.293a1,1,0,0,1,0,1.414L15.414,18l3.293,3.293a1,1,0,0,1,0,1.414l-4,4A1,1,0,0,1,14,27Z" />
        <path d="M30,5H23.243l-2,2H29V23.58l-7.29-7.29a1.008,1.008,0,0,0-1.42,0l-1.879,1.879,1.71,1.71a3,3,0,0,1,0,4.242L17.242,27H30a1,1,0,0,0,1-1V6A1,1,0,0,0,30,5Z" />
        <path d="M18.707,13.293,15.414,10l5-5H2A1,1,0,0,0,1,6V26a1,1,0,0,0,1,1H14.414l4.293-4.293a1,1,0,0,0,0-1.414L15.414,18l3.293-3.293A1,1,0,0,0,18.707,13.293Zm-5.414,4a1,1,0,0,0,0,1.414l2.962,2.962a.471.471,0,0,0,.035.041c.018.018.032.028.047.041l.249.249-.642.642L15,23.58,9.71,18.29a1.008,1.008,0,0,0-1.42,0L3,23.58V7H15.586L13.293,9.293a1,1,0,0,0,0,1.414L16.586,14Z" />
      </svg>
    </>
  </ConditionalWrapper>
);

export default BrokenImg;
