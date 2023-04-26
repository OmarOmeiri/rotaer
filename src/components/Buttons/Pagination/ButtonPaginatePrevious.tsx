/* eslint-disable require-jsdoc */
import React from 'react';
import classes from './PaginationBtns.module.css';
import { IPaginationBtnsProps } from './typings';

const ButtonPaginateBeginning: React.FC<IPaginationBtnsProps> = ({
  size = 24,
  onClick,
}) => (
  <button onClick={onClick} className={classes.Button} style={{ height: `${size}px`, width: `${size}px` }}>
    <svg className={classes.Svg} focusable="false" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
    </svg>
  </button>
);

export default ButtonPaginateBeginning;
