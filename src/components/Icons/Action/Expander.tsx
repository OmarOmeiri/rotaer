import React from 'react';
import classes from './Expander.module.css';

const Expander: React.FC<{
  title?: string,
  id: string,
  style?: React.CSSProperties,
  expanded?: boolean
  innerClassName?: string,
  extraProps?: object
  disabled?: boolean,
  onClick?: React.MouseEventHandler,
}> = ({
  title = 'Expandir',
  id,
  expanded,
  style,
  extraProps,
  disabled = false,
  onClick,
}) => (
  <button
    {...extraProps}
    title={title}
    id={`expander-${id}`}
    data-is-expanded={expanded}
    onClick={onClick}
    style={style}
    className={`${classes.Expandable}`}
  >
    <div
      className={`${classes.Expander} ${disabled ? classes.ExpanderDisabled : ''} ${expanded ? classes.Open : ''}`}
    >
      •
    </div>
  </button>
);

export default Expander;
