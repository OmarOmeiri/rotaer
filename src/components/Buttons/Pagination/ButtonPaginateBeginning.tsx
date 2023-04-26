/* eslint-disable require-jsdoc */
import React from 'react';
import classes from './PaginationBtns.module.css';
import { IPaginationBtnsProps } from './typings';

const ButtonPaginateBeginning: React.FC<IPaginationBtnsProps> = ({
  size = 24,
  onClick,
}) => (
  <button className={classes.Button} style={{ height: `${size}px`, width: `${size}px` }} onClick={onClick}>
    <svg className={classes.Svg} focusable="false" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
    </svg>
  </button>
);

export default ButtonPaginateBeginning;
