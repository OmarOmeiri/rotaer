/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Fragment } from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Misc.module.css';

interface ITagProps {
  size?: number,
  className?: string,
  buttonStyle?: React.CSSProperties,
  onClick?: () => void,
  button?: boolean,
}

const TagIcon: React.FC<ITagProps> = ({
  size = 24,
  className,
  buttonStyle,
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
          ...buttonStyle,
        }}
        onClick={onClick}
        className={`${classes.Btn} ${className}`}
      >
        {children}
      </button>
    )}
  >
    <>
      {/* <svg width={size} height={size} version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" /> */}
      <svg width={size} height={size} version="1.1" viewBox="0 0 95.209 94.987" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-59.68 -87.017)">
          <path d="m76.978 113.35a8.9297 8.9297 0 0 1 8.6808-9.1496 8.9297 8.9297 0 0 1 9.1717 8.6574 8.9297 8.9297 0 0 1-8.634 9.1938 8.9297 8.9297 0 0 1-9.2158-8.6105" strokeOpacity="0" />
          <path d="m68.779 91.463c-2.6846-0.51634-5.2176 2.3298-4.6426 4.9414-0.02995 12.695-0.0599 25.389-0.08984 38.084 14.357 14.389 28.715 28.777 43.072 43.166 14.473-14.436 28.947-28.872 43.42-43.309-14.363-14.326-28.725-28.652-43.088-42.979-12.891 0.0319-25.781 0.0638-38.672 0.0957z" fill="none" stroke="#000" strokeLinejoin="round" strokeWidth="8.7" />
        </g>
      </svg>
    </>
  </ConditionalWrapper>
);

export default TagIcon;
