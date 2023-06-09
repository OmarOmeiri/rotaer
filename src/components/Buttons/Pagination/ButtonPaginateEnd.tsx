/* eslint-disable require-jsdoc */
import React from 'react';
import classes from './PaginationBtns.module.css';
import { IPaginationBtnsProps } from './typings';

const ButtonPaginateEnd: React.FC<IPaginationBtnsProps> = ({
  size = 24,
  onClick,
}) => (
  <button className={classes.Button} onClick={onClick} style={{ height: `${size}px`, width: `${size}px` }}>
    <svg className={classes.Svg} focusable="false" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
    </svg>
  </button>
);

export default ButtonPaginateEnd;
