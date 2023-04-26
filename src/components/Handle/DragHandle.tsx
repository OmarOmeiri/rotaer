import React from 'react';
import classes from './Handle.module.css';

interface IHandleProps {
  height?: number,
  fill?: React.CSSProperties['color']
}

const DragHandle = ({
  height = 20,
  fill = '#000000',
}: IHandleProps) => (
  <div className={classes.DragHandle}>
    <svg width={height * 4} height={height} version="1.1" viewBox="0 0 55.228 13.036" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5.7556e-7 .033409)">
        <path transform="matrix(.26458 0 0 .26458 -4.9989e-7 -.033409)" d="m103.51 0v0.0019531l-103.51 0.125c0 1e-8 10.281 7.1698 19.115 17.514 8.8342 10.344 14.518 31.651 25.205 31.629l60.047-0.125 60.047 0.125c10.687 0.02192 16.369-21.285 25.203-31.629 8.8342-10.344 19.117-17.514 19.117-17.514l-103.52-0.125v-0.0019531l-0.85156 0.0019531z" fill="#e3e3e3" strokeOpacity="0" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill={fill} d="M496 288H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-128H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16z" />
        </svg>
      </g>
    </svg>
  </div>
);

export default DragHandle;
