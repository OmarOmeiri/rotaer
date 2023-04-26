import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import StarIcon from '@mui/icons-material/Star';
import ViewColumn from '@mui/icons-material/ViewColumn';
import classes from './TableOptionsBar.module.css';
import { TableOptionsMenuNames } from './consts';

const TableOptionsButtons = ({
  open,
  hasColumnPresets,
  hasTimeFrames,
  handleClick,
}: {
  open: boolean,
  hasColumnPresets: boolean,
  hasTimeFrames: boolean,
  handleClick: React.MouseEventHandler
}) => (
  <>
    <div className={classes.Right}>
      {
        hasTimeFrames
          ? (
            <Button
              data-name={TableOptionsMenuNames.timeFrames}
              aria-controls={open ? TableOptionsMenuNames.timeFrames : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              disableElevation
              onClick={handleClick}
            >
              <AccessTimeFilledIcon />
            </Button>
          )
          : null
      }
      {
        hasColumnPresets
          ? (
            <Button
              data-name={TableOptionsMenuNames.columnPresets}
              aria-controls={open ? TableOptionsMenuNames.columnPresets : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              disableElevation
              onClick={handleClick}
            >
              <StarIcon />
            </Button>
          )
          : null
      }
      <Button
        data-name={TableOptionsMenuNames.columns}
        aria-controls={open ? TableOptionsMenuNames.columns : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        <ViewColumn />
      </Button>
      <Button
        data-name={TableOptionsMenuNames.settings}
        aria-controls={open ? TableOptionsMenuNames.settings : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        <SettingsIcon />
      </Button>
    </div>
  </>
);

export default TableOptionsButtons;
