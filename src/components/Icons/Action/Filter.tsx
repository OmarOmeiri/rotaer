/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import iconClasses from './ActionIcons.module.css';

interface FilterIconProps{
  size?: number,
  btnId?: string,
  btnName?: string,
  buttonStyle?: React.CSSProperties,
  className?: string,
  buttonClassName?: string,
  button?: boolean,
  style?: React.CSSProperties,
  fill?: string,
  extraProps?: {[key: string]: string}
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const Filter: React.FC<FilterIconProps> = ({
  size = 13,
  className,
  buttonClassName,
  buttonStyle,
  style,
  button,
  btnId,
  btnName,
  fill,
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
        className={`${iconClasses.Btn} ${buttonClassName}`}
        {...extraProps}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg version="1.1" width={size} height={size} className={`${className}`} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          fill={fill ?? 'currentColor'}
          d="M463.952 0H48.057C5.419 0-16.094 51.731 14.116 81.941L176 243.882V416c0 15.108 7.113 29.335 19.2 40l64 47.066c31.273 21.855 76.8 1.538 76.8-38.4V243.882L497.893 81.941C528.042 51.792 506.675 0 463.952 0zM288 224v240l-64-48V224L48 48h416L288 224z"
        />
      </svg>
    </>
  </ConditionalWrapper>
);

export default Filter;
