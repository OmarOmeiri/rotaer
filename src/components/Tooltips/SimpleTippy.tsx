import React from 'react';
import classes from './Tippy.module.css';

export const SimpleTippy = ({
  children,
  arrow,
}: {
  children: React.ReactNode,
  arrow?: 'top' | 'left' | 'right' | 'bottom'
}) => (
  <div className={classes.Tippy} data-placement={arrow}>
    <div className={classes.TippyContent}>{children}</div>
    <div className={classes.TippyArrow}/>
  </div>
);
