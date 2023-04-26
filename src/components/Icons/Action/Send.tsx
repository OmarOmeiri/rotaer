/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './ActionIcons.module.css';

interface SendIconProps{
  size?: number,
  buttonStyle?: React.CSSProperties,
  className?: string,
  buttonClassName?: string,
  button?: boolean,
  style?: React.CSSProperties,
  onClick?: (e: React.MouseEvent) => void
}

const SendIcon: React.FC<SendIconProps> = ({
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
        className={`${classes.Btn} ${buttonClassName}`}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size} className={`${className}`} style={style} version="1.1" viewBox="0 0 152.84 132.91" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-53.822 -67.403)">
          <g strokeOpacity="0">
            <path d="m123.42 133.86c-0.0864-4.4315-2.2355-4.7992-3.6057-4.7992h-54.358s-10.811-41.487-11.401-44.162c-1.7474-10.056 6.3219-19.553 17.84-17.105 3.8754 1.0691 123.24 50.76 127.2 52.763 4.205 2.1261 7.465 6.2366 7.5595 13.418" />
            <path d="m123.42 133.86c-0.0864 4.4315-2.2355 4.7992-3.6057 4.7992h-54.358s-10.811 41.487-11.401 44.162c-1.7474 10.056 6.3218 19.553 17.84 17.105 3.8754-1.0691 123.24-50.76 127.2-52.763 4.205-2.1261 7.465-6.2366 7.5595-13.418" />
          </g>
        </g>
      </svg>
    </>
  </ConditionalWrapper>
);

export default SendIcon;
