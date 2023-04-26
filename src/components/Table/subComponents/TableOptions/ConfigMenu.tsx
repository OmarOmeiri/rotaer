import FilterAltOff from '@mui/icons-material/FilterAltOff';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import React, { useCallback } from 'react';
import classes from './TableOptionsBar.module.css';

type Props = {
  onTableSaveClick?: () => void
  onFontSizeChange?: (type: '+' | '-') => void
  handleClose: () => void
  resetFilters: () => void
}

const btnKeys = {
  cleanFilters: 'clean-filters',
  saveColumns: 'save-columns',
  increaseFont: 'increase-font',
  decreaseFont: 'decrease-font',
};

export const TableConfigMenu = ({
  onTableSaveClick,
  onFontSizeChange,
  handleClose,
  resetFilters,
}: Props) => {
  const onClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    const key = target.getAttribute('data-name');
    const shouldClose = (target.getAttribute('data-no-close') || '').trim();

    switch (key) {
      case btnKeys.cleanFilters: {
        resetFilters();
        break;
      }
      case btnKeys.saveColumns: {
        if (onTableSaveClick) onTableSaveClick();
        break;
      }
      case btnKeys.increaseFont: {
        if (onFontSizeChange) onFontSizeChange('+');
        break;
      }
      case btnKeys.decreaseFont: {
        if (onFontSizeChange) onFontSizeChange('-');
        break;
      }
      default:
        break;
    }
    if (!(shouldClose === 'true'))handleClose();
  }, [
    handleClose,
    onTableSaveClick,
    onFontSizeChange,
    resetFilters,
  ]);

  return (
    <>
      <MenuItem className={classes.Btn} data-name={btnKeys.cleanFilters} onClick={onClick} disableRipple>
        <FilterAltOff />
        Limpar filtros
      </MenuItem>
      {
        onTableSaveClick
          ? (
            <MenuItem className={classes.Btn} data-name={btnKeys.saveColumns} onClick={onClick} disableRipple>
              <SaveIcon />
              Salvar tabela
            </MenuItem>
          )
          : null
      }
      {
        onFontSizeChange
          ? (
            <>
              <MenuItem className={classes.Btn} data-name={btnKeys.increaseFont} onClick={onClick} data-no-close disableRipple>
                <TextIncreaseIcon />
                Aumentar fonte
              </MenuItem>
              <MenuItem className={classes.Btn} data-name={btnKeys.decreaseFont} onClick={onClick} data-no-close disableRipple>
                <TextDecreaseIcon />
                Diminuir fonte
              </MenuItem>
            </>
          )
          : null
      }
    </>
  );
};
