/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Fragment } from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './SDCard.module.css';

interface ISDCardProps {
  size?: number,
  className?: string,
  style?: React.CSSProperties,
  onClick?: () => void,
  button?: boolean,
}

const SDCard: React.FC<ISDCardProps> = ({
  size = 24,
  className,
  style,
  onClick = () => {},
  button,
}) => (

  <ConditionalWrapper
    condition={!!button}
    wrapper={(children) => (
      <button
        style={{
          height: `${size}px`,
          width: `${size}px`,
          ...style,
        }}
        onClick={onClick}
        className={`${classes.Btn} ${className}`}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path fill="currentColor" d="M320 0H128L0 128v320c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zM160 160h-48V64h48v96zm80 0h-48V64h48v96zm80 0h-48V64h48v96z" />
      </svg>
    </>
  </ConditionalWrapper>
);

export default SDCard;
