import React, {
  useCallback,
  useState,
} from 'react';
import MenuBase from '@/components/Menu/MenuBase';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { colors } from '../../config/styles/colors';

const a11yProps = (index: number, open: boolean) => ({
  'aria-controls': open ? 'floating-menu' : undefined,
  'aria-haspopup': 'true',
  'aria-expanded': open ? 'true' : undefined,
} as const);

const isSelected = (
  selected: TypeOrArrayOfType<string> | undefined,
  key: string,
) => {
  if (Array.isArray(selected)) {
    return selected.includes(key);
  }
  return selected === key;
};

const Menu = ({
  children,
  elements,
  selected,
  onClick,
}: {
  children: React.ReactElement,
  selected?: TypeOrArrayOfType<string>,
  elements: {key: string, value: string}[]
  onClick: (key: string) => void
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onItemClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const itemKey = target.getAttribute('data-key');
    if (itemKey) {
      onClick(itemKey);
    }
    handleClose();
  }, [handleClose, onClick]);

  return (
    <>
      <div style={{ marginLeft: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'transparent',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0.2rem',
            borderRadius: '4px 4px 0 0',
            '& *': {
              backgroundColor: 'transparent',
            },
            '& button': {
              backgroundColor: 'transparent',
              minWidth: '40px',
              padding: '4px 4px',
            },
            '& button *': {
              pointerEvents: 'none',
            },
            '& button:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <div>
            <Button
              variant="contained"
              disableElevation
              onClick={handleClick}
              {...a11yProps(0, open)}
            >
              {children}
            </Button>
          </div>
        </Paper>
      </div>
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
        {
          elements.map((e) => (
            <MenuItem
              key={e.key}
              data-key={e.key}
              onClick={onItemClick}
              sx={{
                '&:hover .MuiSvgIcon-root': {
                  opacity: 1,
                },
                color: isSelected(selected, e.key) ? colors.green : colors.white,
              }}
              disableRipple
            >
              {e.value}
            </MenuItem>
          ))
        }
      </MenuBase>
    </>
  );
};

export default Menu;
