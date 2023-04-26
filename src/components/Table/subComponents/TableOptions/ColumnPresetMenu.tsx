import MenuItem from '@mui/material/MenuItem';
import React, { useCallback } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import classes from './TableOptionsBar.module.css';
import Config from '../../../../config';

type Props = {
  columnPresets?: {key: string, name: string, deletable?: boolean}[],
  selectedColPreset?: string | null,
  onTableDeleteClick?: (key: string) => void,
  onColumnPresetClick?: (key: string) => void,
  handleClose: () => void
}
const { colors } = Config.get('styles');

export const TableColumnPresetMenu = ({
  columnPresets,
  selectedColPreset,
  onColumnPresetClick,
  onTableDeleteClick,
  handleClose,
}: Props) => {
  const onClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const key = target.getAttribute('data-key');
    if (key) {
      if (onColumnPresetClick) onColumnPresetClick(key);
    }
    handleClose();
  }, [handleClose, onColumnPresetClick]);

  if (!columnPresets?.length) {
    return null;
  }
  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const key = (e.target as HTMLButtonElement).getAttribute('data-key');
    if (key && onTableDeleteClick) onTableDeleteClick(key);
  };

  return (
    <>
      {
      columnPresets.map((preset) => (
        <MenuItem
          key={preset.key}
          data-key={preset.key}
          onClick={onClick}
          sx={{
            '&:hover .MuiSvgIcon-root': {
              opacity: 1,
            },
            color: preset.key === selectedColPreset ? colors.green : 'inherit',
          }}
          disableRipple
        >
          {preset.name}
          {
            preset.deletable
              ? (
                <Button
                  className={classes.ClearBtn}
                  data-key={preset.key}
                  variant="text"
                  sx={{
                    minWidth: '0',
                    padding: '0',
                    marginLeft: 'auto',
                    '& *': {
                      pointerEvents: 'none',
                    },
                  }}
                  onClick={onDeleteClick}
                  disableRipple
                  >
                  <ClearIcon sx={{
                    margin: 0,
                    fontSize: '0.9em',
                    marginRight: '0 !important',
                    transition: 'opacity 0.2s ease',
                    opacity: 0,
                  }}/>
                </Button>
              )
              : null
          }

        </MenuItem>
      ))
    }
    </>
  );
};
// {
//   preset.canDelete
//     ? <Button variant="text">
//       <ClearIcon/>
//     </Button>
//     : null
// }
