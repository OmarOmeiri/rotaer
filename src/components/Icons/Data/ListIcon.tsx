/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import iconClasses from './Data.module.css';

interface ListIconProps{
  size?: number,
  btnId?: string,
  btnName?: string,
  buttonStyle?: React.CSSProperties,
  className?: string,
  buttonClassName?: string,
  button?: boolean,
  style?: React.CSSProperties,
  extraProps?: {[key: string]: string}
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ListIcon: React.FC<ListIconProps> = ({
  size = 13,
  className,
  buttonClassName,
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
        className={`${iconClasses.Btn} ${buttonClassName}`}
        {...extraProps}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size} height={size} className={`${className} svg-icon`} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M80 48H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416-136H176a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V88a16 16 0 0 0-16-16z"
        />
      </svg>
    </>
  </ConditionalWrapper>
);

export default ListIcon;
