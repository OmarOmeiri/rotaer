import React, { useCallback } from 'react';
import MUIMenu, { MenuProps } from '@mui/material/Menu';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import classes from './Menu.module.css';
import { MENU_BG, MENU_FONT_COLOR, MENU_BG_HOVER } from './menuStyles';

const MenuBase = (props: MenuProps) => {
  const close = useCallback(() => {
    if (
      props.onClose
    ) {
      props.onClose({}, 'backdropClick');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onClose]);

  const clickAway = useCallback((e: MouseEvent | TouchEvent) => {
    if (
      props.anchorEl !== e.target
    ) {
      close();
    }
  }, [close, props.anchorEl]);

  React.useEffect(() => {
    window.addEventListener('scroll', close);
    return () => {
      window.removeEventListener('scroll', close);
    };
  }, [close]);

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <MUIMenu
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        disableScrollLock
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: MENU_BG,
            borderRadius: '4px',
            marginTop: 1,
            minWidth: 180,
            color: MENU_FONT_COLOR,
            boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
              padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
              fontSize: 16,
              '& .MuiSvgIcon-root': {
                width: '1em',
                height: '1em',
                color: MENU_FONT_COLOR,
                marginRight: 1.5,
              },
              '&:hover': {
                backgroundColor: MENU_BG_HOVER,
                transition: '0.2s ease',
              },
              '&:active': {
                backgroundColor: MENU_BG_HOVER,
              },
            },
            '& .MuiSvgIcon-root': {
              width: '1.3em',
              height: '1.3em',
            },
          },
        }}
        {...props}
        className={
          `${props.className} ${props.hideBackdrop ? classes.BackDropPointerEvts : ''}`
        }
      />
    </ClickAwayListener>
  );
};

export default MenuBase;
