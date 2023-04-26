/* eslint-disable import/prefer-default-export */
import React, { forwardRef } from 'react';
import classes from './ButtonMain.module.css';
import { IButtonMainProps, btnStyleType } from './typings';

/**
 * A button component
 * @param {func} click the click handler
 * @param {string} children the button text
 * @param {String} type success or danger
 * @returns {JSX} button
 */
export const ButtonMain: React.FC<IButtonMainProps> = forwardRef(({
  onClick = () => {},
  children,
  className,
  styleType,
  type = 'button',
  style,
}, ref: React.ForwardedRef<HTMLButtonElement>) => {
  let btnClass;
  switch (styleType) {
    case btnStyleType.success:
      btnClass = classes.Success;
      break;
    case btnStyleType.danger:
      btnClass = classes.Danger;
      break;
    case btnStyleType.main:
      btnClass = classes.MainBtn;
      break;
    case btnStyleType.norm:
      btnClass = classes.Btn;
      break;
    default:
      btnClass = null;
      break;
  }

  return (
    <button
      type={type}
      style={style}
      ref={ref}
      className={typeof className === 'undefined' ? `${classes.Button} ${btnClass}` : className}
      onClick={onClick}
    >
      {children}
    </button>
  );
});
