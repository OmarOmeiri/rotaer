import React from 'react';
import classes from './MainMenu.module.css';

const MainMenuBtn = ({
  icon,
  children,
  onClick,
}: {
  icon: JSX.Element,
  children: React.ReactNode,
  onClick?: React.MouseEventHandler
}) => (
  <button className={classes.MenuBtn} onClick={onClick}>
    <div className={classes.BtnIconContainer}>
      {icon}
    </div>
    <div className={classes.BtnTextContainer}>
      {children}
    </div>
  </button>
);

export default MainMenuBtn;
