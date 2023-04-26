import React, {
  forwardRef,
} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { SxProps, Theme } from '@mui/material';
import Config from '../../config';
import classes from './CheckboxList.module.css';

type ValueType = Array<string | boolean>
| Array<{value: string | JSX.Element, id: string, disabled?: boolean}>

type Props = {
  checked: number[];
  listStyles?: SxProps<Theme>
  checkboxStyles?: SxProps<Theme>
  listItemStyles?: SxProps<Theme>
  values: ValueType,
  name: string,
  handleToggle: React.MouseEventHandler,
}

const { colors } = Config.get('styles');

const getValue = (value: ValueType[number]) => {
  if (typeof value === 'object') return value.value;
  if (typeof value === 'boolean') {
    return value === true ? 'Sim' : 'Não';
  }
  return value;
};
const key = (d: ValueType[number], i: number): string => (
  typeof d === 'string' || typeof d === 'boolean'
    ? `${String(d)}-${i}`
    : `${d.id}-${i}`
);

export const BaseCheckboxList = forwardRef(({
  checked,
  listStyles = {},
  checkboxStyles = {},
  listItemStyles = {},
  name,
  values,
  handleToggle,
}: Props, ref: React.ForwardedRef<HTMLUListElement>) => (
  <List sx={{
    width: '100%',
    maxWidth: 360,
    bgcolor: 'transparent',
    ...listStyles,
  }}
    className={classes.CheckboxList}
    ref={ref}
  >
    {values.map((value, i) => {
      const id = typeof value === 'object' ? value.id : value.toString();
      const labelId = `checkbox-list-label-${id}`;

      return (
        <ListItem
          key={key(value, i)}
          disablePadding
        >
          <ListItemButton
            className={classes.CheckboxListButton}
            data-name={name}
            data-id={id}
            data-index={i}
            role={undefined}
            onClick={handleToggle}
            dense
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                size='small'
                checked={checked.indexOf(i) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
                disabled={typeof value === 'object' ? !!value.disabled : false}
                sx={{
                  color: colors.white,
                  '&.Mui-checked': {
                    color: colors.green,
                  },
                  '& .MuiCheckbox-root': {
                    '& .MuiSvgIcon-root': {
                      width: '1em',
                      height: '1em',
                      marginRight: 1.5,
                    },
                  },
                  ...checkboxStyles,
                }}
              />
            </ListItemIcon>
            <ListItemText
              sx={{
                ...listItemStyles,
              }}
              id={labelId}
              primary={getValue(value)}
            />
          </ListItemButton>
        </ListItem>
      );
    })}
  </List>
));
