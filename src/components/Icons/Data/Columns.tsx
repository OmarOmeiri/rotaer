/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import iconClasses from './Data.module.css';

interface ColumnsIconProps{
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

const Columns: React.FC<ColumnsIconProps> = ({
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
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={size} height={size} className={`${className}`} style={style} viewBox="0 0 24 24">
        <path
          d="M19.893 3.001H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h15.893c1.103 0 2-.897 2-2V5a2.003 2.003 0 0 0-2-1.999zM8 19.001H4V8h4v11.001zm6 0h-4V8h4v11.001zm2 0V8h3.893l.001 11.001H16z"
        />
      </svg>
    </>
  </ConditionalWrapper>
);

export default Columns;
