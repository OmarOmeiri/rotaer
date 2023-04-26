/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable require-jsdoc */
import React, { Fragment } from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Order.module.css';

interface SortZAProps {
  size?: number,
  className?: string,
  fill?: string,
  buttonClassName?: string,
  buttonStyle?: React.CSSProperties,
  buttonTitle?: string,
  style?: React.CSSProperties,
  button?: boolean,
  btnId?: string,
  onClick?: () => void
}

const SortZA: React.FC<SortZAProps> = ({
  size = 24,
  buttonClassName,
  className,
  fill,
  buttonStyle,
  buttonTitle,
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
        title={buttonTitle}
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
      <svg width={size} height={size} className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill={!fill ? 'currentColor' : fill} d="M176 352h-48V48a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v304H16c-14.19 0-21.36 17.24-11.29 27.31l80 96a16 16 0 0 0 22.62 0l80-96C197.35 369.26 190.22 352 176 352zm112-128h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-56l61.26-70.45A32 32 0 0 0 432 65.63V48a16 16 0 0 0-16-16H288a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h56l-61.26 70.45A32 32 0 0 0 272 190.37V208a16 16 0 0 0 16 16zm159.06 234.62l-59.27-160A16 16 0 0 0 372.72 288h-41.44a16 16 0 0 0-15.07 10.62l-59.27 160A16 16 0 0 0 272 480h24.83a16 16 0 0 0 15.23-11.08l4.42-12.92h71l4.41 12.92A16 16 0 0 0 407.16 480H432a16 16 0 0 0 15.06-21.38zM335.61 400L352 352l16.39 48z" />
      </svg>
    </>
  </ConditionalWrapper>
);

export default SortZA;
