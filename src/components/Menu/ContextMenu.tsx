import * as React from 'react';
import { ContextMenuContext } from '@/context/menuContext';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  MENU_BG,
  MENU_BG_HOVER,
  MENU_FONT_COLOR,
} from './menuStyles';

const ContextMenu = () => {
  const {
    contextMenu,
    elements,
    onItemClick,
    handleClose,
  } = React.useContext(ContextMenuContext);

  React.useEffect(() => {
    window.addEventListener('scroll', handleClose);
    return () => {
      window.removeEventListener('scroll', handleClose);
    };
  }, [handleClose]);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        hideBackdrop
        disableScrollLock
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          pointerEvents: 'none',
          '& .MuiPaper-root': {
            pointerEvents: 'auto',
            backgroundColor: MENU_BG,
            borderRadius: '4px',
            marginTop: 1,
            minWidth: 150,
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
      >
        {
          elements.map((e) => (
            <MenuItem
              key={e.key}
              data-key={e.key}
              onClick={onItemClick}
              sx={{
                paddingLeft: '0.8em',
                paddingRight: '0.8em',
                '& *': {
                  pointerEvents: 'none',
                },
                '&:hover .MuiSvgIcon-root': {
                  opacity: 1,
                },
              }}
              disableRipple
            >
              {e.value}
            </MenuItem>
          ))
        }
      </Menu>
    </ClickAwayListener>
  );
};

export default ContextMenu;
