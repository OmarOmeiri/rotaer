/* eslint-disable require-jsdoc */
import React from 'react';
import classes from './PaginationBtns.module.css';
import { IPaginationBtnsProps } from './typings';

const ButtonPaginateNext: React.FC<IPaginationBtnsProps> = ({
  size = 24,
  onClick,
}) => (
  <button className={classes.Button} onClick={onClick} style={{ height: `${size}px`, width: `${size}px` }}>
    <svg className={classes.Svg} focusable="false" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
    </svg>
  </button>
);
export default ButtonPaginateNext;
