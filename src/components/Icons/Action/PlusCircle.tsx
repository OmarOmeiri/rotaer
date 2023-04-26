/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import iconClasses from './ActionIcons.module.css';

interface PlusCircleIconProps{
  size?: number,
  buttonStyle?: React.CSSProperties,
  className?: string,
  buttonClassName?: string,
  button?: boolean,
  style?: React.CSSProperties,
  onClick?: (e: React.MouseEvent) => void
}

const PlusCircle: React.FC<PlusCircleIconProps> = ({
  size = 13,
  className,
  buttonClassName,
  buttonStyle,
  style,
  button,
  onClick = () => {},
}) => (
  <ConditionalWrapper
    condition={!!button}
    wrapper={(children) => (
      <button
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
      <svg version="1.1" width={size} className={`${className}`} style={style} viewBox="0 0 182.77 182.77" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(301.74 278.35)">
          <path d="m-159.35-198.66h-38.1v-38.1c0-4.6752-3.7915-8.4667-8.4667-8.4667h-8.4667c-4.6752 0-8.4667 3.7915-8.4667 8.4667v38.1h-38.1c-4.6752 0-8.4667 3.7915-8.4667 8.4667v8.4667c0 4.6752 3.7915 8.4667 8.4667 8.4667h38.1v38.1c0 4.6752 3.7915 8.4667 8.4667 8.4667h8.4667c4.6752 0 8.4667-3.7915 8.4667-8.4667v-38.1h38.1c4.6752 0 8.4667-3.7915 8.4667-8.4667v-8.4667c0-4.6752-3.7915-8.4667-8.4667-8.4667z" strokeWidth=".26458" />
        </g>
        <path d="m9.4545 94.178a82.682 82.682 0 0 1 80.377-84.718 82.682 82.682 0 0 1 84.923 80.161 82.682 82.682 0 0 1-79.944 85.127 82.682 82.682 0 0 1-85.331-79.726" fillOpacity="0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="17.6" />
      </svg>

    </>
  </ConditionalWrapper>
);

export default PlusCircle;
