import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import styled from 'styled-components';
import X from '@icons/X.svg';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { DropDownItem } from './DropDown';
import { colors } from '../../config/styles/colors';
import classes from './DropDown.module.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  // PaperProps: {
  //   style: {
  //     maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
  //     width: 250,
  //   },
  // },

  disableScrollLock: true,
  hideBackdrop: true,
  className: classes.BackDropPointerEvts,
  PaperProps: {
    sx: {
      bgcolor: colors.darklight,
      color: colors.white,
      maxHeight: '200px',
      '& .MuiMenuItem-root': {
        padding: 1,
      },
    },
  },

};

const DEFAULT_LABEL_SX_PROPS = {
  color: colors.lightGrey,
  '&.Mui-focused': {
    color: colors.green,
  },

};

const DEFAULT_SELECT_SX_PROPS = {
  color: colors.white,

  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.lightGrey,
    borderWidth: '0.1em',
  },

  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: `${colors.green} !important`,
    borderWidth: '0.1em',
  },

};

const StyledChip = styled.div`
background-color: ${colors.darklight};`;

const MultipleSelectChip = ({
  values,
  label,
}: {
  values: DropDownItem[],
  label?: string,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    const handler = () => {
      setIsOpen(false);
    };
    window.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, []);

  const handleChange = React.useCallback((event: SelectChangeEvent<typeof selected>) => {
    const {
      target: { value },
    } = event;
    setSelected(
      typeof value === 'string' ? value.split(',') : value,
    );
  }, []);

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOpen = React.useCallback((e: React.SyntheticEvent<Element, Event>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains(classes.MultiDropDownChip)) {
      return;
    }
    setIsOpen(true);
  }, []);

  const clickAway = React.useCallback((e: MouseEvent | TouchEvent) => {
    // if (
    //   props.anchorEl !== e.target
    // ) {
    onClose();
    // }
  }, [onClose]);

  const onChipClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement | null;
    const id = target?.getAttribute('data-id');
    if (id) {
      setSelected((state) => {
        const index = state.findIndex((item) => (
          JSON.parse(item as Stringified<DropDownItem>).id === id
        ));
        if (index > -1) {
          const copy = [...state];
          copy.splice(index, 1);
          return copy;
        }
        return state;
      });
    }
  }, []);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        {label ? (
          <InputLabel
            sx={DEFAULT_LABEL_SX_PROPS}
          >
            {label}
          </InputLabel>
        ) : null}
        <ClickAwayListener onClickAway={clickAway}>
          <Select
          value={selected}
          label={label}
          sx={DEFAULT_SELECT_SX_PROPS}
          multiple
          open={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              pointerEvents: 'none',
            }}>
              {
                selected.map((value) => {
                  const obj = JSON.parse(value as Stringified<DropDownItem>);
                  return (
                    <StyledChip
                      key={value}
                      className={classes.MultiDropDownChip}
                      style={{ pointerEvents: 'auto' }}
                      data-id={obj.id}
                      onClick={onChipClick}
                    >
                      {obj.value}
                      <div className={classes.DeleteIcon}>
                        <X stroke='rgb(249, 86, 86)'/>
                      </div>
                    </StyledChip>
                  );
                })
              }
            </Box>
          )}
          MenuProps={MenuProps}
        >
            {values.map((v) => (
              <MenuItem
              key={v.id}
              value={JSON.stringify(v)}
              data-id={v.id}
            >
                {v.value}
              </MenuItem>
            ))}
          </Select>
        </ClickAwayListener>
      </FormControl>
    </div>
  );
};

export default MultipleSelectChip;
