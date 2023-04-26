import {
  cloneElement, useCallback, useRef, useState,
} from 'react';
import MenuBase from './MenuBase';

export const WithMenu = ({
  button,
  children,
}: {
  button: JSX.Element
  children: React.ReactNode
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const ref = useRef<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClick = useCallback(() => {
    setAnchorEl(ref.current);
  }, []);

  return (
    <>
      {cloneElement(button, {
        ...button.props,
        onClick: handleClick,
        ref,
      })}
      <MenuBase
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': 'clear-filters',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        hideBackdrop
      >
        {children}
      </MenuBase>
    </>
  );
};
