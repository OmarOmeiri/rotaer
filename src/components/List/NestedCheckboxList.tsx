import {
  useState,
  forwardRef,
  memo,
  useMemo,
  useCallback,
} from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { SxProps, Theme } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import classes from './CheckboxList.module.css';
import { useCheckboxList } from './useCheckboxList';
import { BaseCheckboxList } from './CheckboxListBase';

type ValueType = {value: string, id: string, disabled?: boolean};

type Props = {
  initChecked?: Array<string>;
  listStyles?: React.CSSProperties
  checkboxStyles?: SxProps<Theme>
  listItemStyles?: SxProps<Theme>
  values: {[key: string]: Array<ValueType>}
  onChange: ListSelectEventHandler,
}

const NestedCheckboxList = forwardRef(({
  initChecked,
  listStyles = {},
  checkboxStyles = {},
  listItemStyles = {},
  values,
  onChange,
}: Props, ref: React.ForwardedRef<HTMLUListElement>) => {
  const [open, setOpen] = useState<{[K: string]: boolean}>({});
  const mergedValues = useMemo(() => Object.values(values).reduce((arr, v) => [
    ...arr,
    ...v,
  ], [] as ValueType[]), [values]);

  const {
    handleToggle,
  } = useCheckboxList({
    initChecked,
    values: mergedValues,
    onChange,
  });

  const getCheked = useCallback((value: ValueType[]) => (
    (initChecked || []).reduce((ch, c) => {
      const ix = value.findIndex((v) => v.id === c);
      if (ix > -1) return [...ch, ix];
      return ch;
    }, [] as number[])
  ), [initChecked]);

  const handleOpen: React.MouseEventHandler = (e) => {
    const name = (e.target as HTMLDivElement).getAttribute('data-name');
    if (name) {
      setOpen((state) => ({
        ...state,
        [name]: !state?.[name],
      }));
    }
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'transparent',
      }}
      style={listStyles}
      className={classes.CheckboxList}
      ref={ref}
    >
      {Object.entries(values).map(([catg, value]) => (
        <>
          <ListItemButton data-name={catg} onClick={handleOpen} sx={{ '& *': { pointerEvents: 'none' } }}>
            <ListItemText primary={catg} />
            {!open[catg] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={!!open[catg]} timeout="auto" sx={{ paddingLeft: '0.3em' }} unmountOnExit>
            <BaseCheckboxList
              ref={ref}
              checked={getCheked(value)}
              checkboxStyles={checkboxStyles}
              listItemStyles={listItemStyles}
              listStyles={{ bgcolor: 'rgba(255, 255, 255, 0.15)' }}
              values={value}
              name={catg}
              handleToggle={handleToggle}
            />
          </Collapse>
        </>
      ))}
    </List>
  );
});

export default memo(NestedCheckboxList);
