import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useEffect, useRef, useState } from 'react';
import classes from './SplitButtons.module.css';
import { colors } from '../../config/styles/colors';

type Props = {
  items: {id: string, name: string, disabled?: boolean}[],
  selected: string,
  onClick: (id: string) => void
}

const findSelected = (id: string, items: Props['items']) => {
  if (!id) return 0;
  const ix = items.findIndex((i) => i.id === id);
  return Math.max(ix, 0);
};

const SplitButtons = ({
  items,
  selected,
  onClick,
}: Props) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(findSelected(selected, items));

  useEffect(() => {
    setSelectedIndex(findSelected(selected, items));
  }, [selected, items]);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
  ) => {
    const target = event.target as HTMLElement;
    const index = Number(target?.getAttribute('data-index') || undefined);
    if (!Number.isNaN(index)) {
      setSelectedIndex(index);
      onClick(items[index].id);
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current
      && anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" sx={{
        lineHeight: '1.2rem',
        borderRadius: '1.2rem',
        outline: `1px solid ${colors.grey}`,
      }}>
        <div className={classes.SelectedItemWrapper}>
          <span style={{ borderRight: `1px solid ${colors.grey}` }}>{items[selectedIndex].name}</span>
        </div>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}
          sx={{
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&:hover .MuiSvgIcon-root': {
              fill: colors.green,
            },
          }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 3,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper sx={{
              backgroundColor: `${colors.darklight}`,
              color: `${colors.white}`,
            }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {items.map((item, i) => (
                    <MenuItem
                      key={item.id}
                      data-index={i}
                      disabled={item.disabled}
                      onClick={handleMenuItemClick}
                      sx={{
                        color: selectedIndex === i ? colors.green : 'inherit',
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default SplitButtons;
