import React from 'react';
import CardWithTitle from '../Card/CardWithTitle';
import classes from './StyledTooltip.module.css';

const StyledTooltip = ({
  title,
  children,
}: {title: string, children: React.ReactNode}) => (
  <CardWithTitle title={title} titleClassName={classes.TooltipTitle} className={classes.TooltipContent}>
    {children}
  </CardWithTitle>
);

export default StyledTooltip;
