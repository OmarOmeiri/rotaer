import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Config from '../../config';

type Props = {
  open: boolean,
  setOpen: SetState<boolean>
  children: React.ReactNode
  anchor?: 'top' | 'left' | 'right' | 'bottom'
}

const appStyles = Config.get('styles');

const wrapperStyle = {
  backgroundColor: appStyles.colors.darklight,
};

const FullDrawer = ({
  open,
  children,
  anchor = 'left',
  setOpen,
}: Props) => {
  const toggleDrawer = React.useCallback((event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown'
        && ((event as React.KeyboardEvent).key === 'Tab'
          || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setOpen((state) => !state);
  }, [setOpen]);

  return (
    <div>
      <Drawer
        anchor={anchor}
        open={open}
        onClose={toggleDrawer}
        PaperProps={{ sx: wrapperStyle }}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          {children}
        </Box>
      </Drawer>
    </div>
  );
};

export default FullDrawer;
