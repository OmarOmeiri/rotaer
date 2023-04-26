import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { colors } from '../../config/styles/colors';

export type DropDownItem = {value: string, id: string}
type Props = {
  items: {value: string, id: string}[]
  label?: string,
  selected?: string,
  onChange?: (id: string) => void
}

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

const DropDown = ({
  items,
  label,
  selected,
  onChange,
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState({ value: '', id: '' });

  React.useEffect(() => {
    const handler = () => {
      setIsOpen(false);
    };
    window.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, []);

  const handleChange = (
    _event: SelectChangeEvent,
    child: React.ReactElement<{'data-id': string, value: string}>,
  ) => {
    const { value, 'data-id': id } = child.props;
    setValue({ value, id });
  };

  React.useEffect(() => {
    if (onChange && value.id) onChange(value.id);
  }, [value, onChange]);

  React.useEffect(() => {
    if (selected) {
      const ix = items.findIndex((i) => i.id === selected);
      if (ix > -1) setValue(items[ix]);
      else setValue({ value: '', id: '' });
    }
  }, [selected, items]);

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOpen = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        {label ? (
          <InputLabel
            sx={DEFAULT_LABEL_SX_PROPS}
          >
            {label}
          </InputLabel>
        ) : null}
        <Select
          value={value.value}
          label={label}
          sx={DEFAULT_SELECT_SX_PROPS}
          open={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          MenuProps={{
            disableScrollLock: true,
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
          }}
          onChange={handleChange as any}
        >
          {
            items.map((i) => (
              <MenuItem
                key={i.id}
                value={i.value}
                data-id={i.id}
              >
                {i.value}
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </div>
  );
};

export default DropDown;
