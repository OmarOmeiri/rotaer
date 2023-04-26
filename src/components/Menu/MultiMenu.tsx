import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import MenuBase from '@/components/Menu/MenuBase';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { colors } from '../../config/styles/colors';

export type MultiMenuButtonProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  name: string,
  // eslint-disable-next-line react/no-unused-prop-types
  elements: TypeOrArrayOfType<{key: string, value: string}>
  // eslint-disable-next-line react/no-unused-prop-types
  onClick: (key: string) => void
}

type MenuIndex = {
  [x: string]: {
    elements: {
      key: string;
      value: string;
    }[],
    onClick: (key: string) => void
  };
}

const a11yProps = (index: number, open: boolean) => ({
  'aria-controls': open ? 'floating-menu' : undefined,
  'aria-haspopup': 'true',
  'aria-expanded': open ? 'true' : undefined,
} as const);

export const MultiMenuItem = ({
  children,
}:{
  children: React.ReactElement,
} & MultiMenuButtonProps) => (
  <>
    {children}
  </>
);

const Items = ({
  menuIndex,
  menuKey,
  selected,
  onClick,
}: {
  menuIndex: MenuIndex
  menuKey: string | null,
  selected?: {[menuKey: string]: TypeOrArrayOfType<string>},
  onClick: React.MouseEventHandler
}) => {
  const isSelected = useCallback((
    selected: TypeOrArrayOfType<string> | undefined,
    key: string,
  ) => {
    if (Array.isArray(selected)) {
      return selected.includes(key);
    }
    return selected === key;
  }, []);

  return (
    <>
      {
      menuKey
        ? (menuIndex[menuKey].elements || [])
          .map((e) => (
            <MenuItem
              key={e.key}
              data-key={e.key}
              data-menu-key={e.key}
              onClick={onClick}
              sx={{
                '&:hover .MuiSvgIcon-root': {
                  opacity: 1,
                },
                color: isSelected(selected?.[menuKey], e.key) ? colors.green : colors.white,
              }}
              disableRipple
            >
              {e.value}
            </MenuItem>
          ))
        : null
    }
    </>
  );
};

const MultiMenu = ({
  children,
  selected,
}: {
  children: TypeOrArrayOfType<React.ReactElement<MultiMenuButtonProps>>,
  selected?: {[menuKey: string]: TypeOrArrayOfType<string>},
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const menuKey = useMemo(() => (
    anchorEl?.getAttribute('data-key') || null
  ), [anchorEl]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const menuIndex = useMemo(() => {
    const ix: MenuIndex = {};
    React.Children.forEach(children, (child) => {
      const { name, elements, onClick } = child.props;
      if (!name) {
        throw new Error('Menu Children must have a "name" prop.');
      }
      if (!elements) {
        throw new Error('Menu Children must have an "elements" prop.');
      }
      if (!onClick) {
        throw new Error('Menu Children must have an "onClick" prop.');
      }
      ix[name] = {
        elements: Array.isArray(elements) ? elements : [elements],
        onClick: child.props.onClick,
      };
    });

    return ix;
  }, [children]);

  const onItemClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const itemKey = target.getAttribute('data-key');
    if (itemKey && menuKey && menuIndex[menuKey]) {
      menuIndex[menuKey].onClick(itemKey);
    }
    handleClose();
  }, [handleClose, menuKey, menuIndex]);

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
            {
              React.Children.map(children, (child, i) => (
                React.isValidElement(child)
                  ? (
                    <Button
                      key={child.props.name}
                      data-key={child.props.name}
                      variant="contained"
                      disableElevation
                      onClick={handleClick}
                      {...a11yProps(i, open)}
                    >
                      {child}
                    </Button>
                  )
                  : null
              ))
            }
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
        <Items menuIndex={menuIndex} menuKey={menuKey} selected={selected} onClick={onItemClick}/>
      </MenuBase>
    </>
  );
};

export default MultiMenu;
