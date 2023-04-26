/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import iconClasses from './ActionIcons.module.css';
import classes from './CheckCircle.module.css';

interface CheckCircleIconProps{
  size?: number,
  buttonStyle?: React.CSSProperties,
  className?: string,
  buttonClassName?: string,
  button?: boolean,
  style?: React.CSSProperties,
  circleColor?: string
  checkColor?: string,
  btnId?: string,
  circleStrokeWidth?: number,
  animateCircle?: boolean,
  onClick?: (e: React.MouseEvent) => void
}

const CheckCircle: React.FC<CheckCircleIconProps> = ({
  size = 13,
  className,
  buttonClassName,
  buttonStyle,
  style,
  button,
  btnId,
  circleColor,
  checkColor,
  circleStrokeWidth = 10,
  animateCircle,
  onClick = () => {},
}) => (
  <ConditionalWrapper
    condition={!!button}
    wrapper={(children) => (
      <button
        style={{
          ...buttonStyle,
        }}
        data-id={btnId}
        onClick={onClick}
        className={`${iconClasses.Btn} ${buttonClassName} ${classes.CheckCircle}`}
      >
        {children}
      </button>
    )}
  >
    <>
      <svg width={size} className={`${className} ${classes.CheckCircle}`} style={style} version="1.1" viewBox="-68.274 -13.798 131.3 131.3" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-68.274 -13.797)">
          <g transform="translate(310.65,240.43)" style={{ mixBlendMode: 'normal', paintOrder: 'fill' }}>
            <path transform="translate(-.077763)" d="m-282.49-168.83 24.869 25.043c1.03 1.0372 2.7055 1.0441 3.744 0.0153l46.487-46.055c1.0415-1.0318 1.0588-2.7095 0.0387-3.7625l-6.6748-6.8901c-0.48599-0.50165-1.1527-0.78766-1.8511-0.79411-0.69842-6e-3 -1.3703 0.26722-1.8655 0.75981l-37.944 37.75-16.053-16.283c-1.0313-1.0462-2.7105-1.0736-3.7754-0.0616l-6.9217 6.5778c-0.50475 0.47967-0.79494 1.1425-0.80502 1.8387-0.0101 0.69624 0.26078 1.3672 0.75142 1.8613z" strokeDasharray="217.04" fill={checkColor} strokeDashoffset="217.04" strokeWidth="0" style={{ mixBlendMode: 'normal', paintOrder: 'fill' }} />
            <path className={animateCircle ? `${classes.CircleAnim}` : ''} d="m-186.96-174.78c0 15.392-6.1146 30.154-16.999 41.038-10.884 10.884-25.646 16.999-41.038 16.999-15.392 2.7e-4 -30.154-6.1141-41.039-16.998-10.884-10.884-16.999-25.646-16.999-41.038-2.6e-4 -15.392 6.1141-30.154 16.998-41.039 10.884-10.884 25.646-16.999 41.038-16.999 32.053-5.5e-4 58.037 25.982 58.038 58.035" fill="none" stroke={circleColor} strokeDasharray="364.67" strokeDashoffset="0" strokeLinejoin="round" strokeWidth={`${circleStrokeWidth}`} style={{ mixBlendMode: 'normal', paintOrder: 'fill' }} />
          </g>
        </g>
      </svg>
    </>
  </ConditionalWrapper>
);

export default CheckCircle;
