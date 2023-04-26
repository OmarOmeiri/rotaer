import { useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { colors } from '../../../../config/styles/colors';

type Props = {
  timeframes?: { key: string, name: string }[],
  selectedTimeframe?: string,
  onTimeframeClick?: (key: string) => void,
  handleClose: () => void
}

const TableTimeFrameMenu = ({
  timeframes,
  selectedTimeframe,
  onTimeframeClick,
  handleClose,
}: Props) => {
  const onClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const key = target.getAttribute('data-key');
    if (key) {
      if (onTimeframeClick) onTimeframeClick(key);
    }
    handleClose();
  }, [handleClose, onTimeframeClick]);

  if (!timeframes?.length) {
    return null;
  }

  return (
    <>
      {
      timeframes.map((tf) => (
        <MenuItem
          key={tf.key}
          data-key={tf.key}
          onClick={onClick}
          sx={{
            '&:hover .MuiSvgIcon-root': {
              opacity: 1,
            },
            color: tf.key === selectedTimeframe ? colors.green : 'inherit',
          }}
          disableRipple
        >
          {tf.name}
        </MenuItem>
      ))
    }
    </>
  );
};

export default TableTimeFrameMenu;
