/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import iconClasses from './ActionIcons.module.css';

interface EraserIconProps{
  size?: number,
  buttonStyle?: React.CSSProperties,
  btnId?: string
  className?: string,
  buttonClassName?: string,
  button?: boolean,
  style?: React.CSSProperties,
  title?: string,
  onClick?: (e: React.MouseEvent) => void
}

const Eraser: React.FC<EraserIconProps> = ({
  size = 13,
  className,
  buttonClassName,
  title,
  btnId,
  buttonStyle,
  style,
  button,
  onClick = () => {},
}) => (
  <ConditionalWrapper
    condition={!!button}
    wrapper={(children) => (
      <button
        title={title}
        data-id={btnId}
        style={{
          ...buttonStyle,
        }}
        onClick={onClick}
        className={`${iconClasses.Btn} ${buttonClassName}`}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size} className={`${className}`} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M497.94 273.94a48 48 0 0 0 0-67.88l-160-160a48 48 0 0 0-67.88 0l-256 256a48 48 0 0 0 0 67.88l96 96A48 48 0 0 0 144 480h356a12 12 0 0 0 12-12v-24a12 12 0 0 0-12-12H339.88l158.06-158.06zM304 80l160 160-103 103-160-160zM144 432l-96-96 119-119 160 160-55 55z"
        />
      </svg>
    </>
  </ConditionalWrapper>
);

export default Eraser;
