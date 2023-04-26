import React from 'react';
import classes from './ChartGrid.module.css';

type Props = {
  children: React.ReactNode,
  onClick: (e: React.MouseEvent) => void
}

export const ChartGridButton = ({
  children,
  onClick,
}: Props) => (
  <button className={classes.Btn} onClick={onClick}>
    {children}
  </button>
);
