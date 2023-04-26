import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import MenuBase from '@/components/Menu/MenuBase';
import Paper from '@mui/material/Paper';
import NestedCheckboxList from '../../../List/NestedCheckboxList';
import { TableColumnPresetMenu } from './ColumnPresetMenu';
import { TableConfigMenu } from './ConfigMenu';
import {
  TABLE_OPTIONS_BG,
  TABLE_OPTIONS_BG_HOVER,
  TABLE_OPTIONS_FONT_COLOR,
  TableOptionsMenuNames,
} from './consts';
import classes from './TableOptionsBar.module.css';
import TableOptionsButtons from './TableOptionsButtons';
import TableTimeFrameMenu from './TimeFrameMenu';

type Props = {
  selectedCols: TableCols<any>[],
  categorizedColumns: {[k: string]: {value: string, id: string}[]}
  columnPresets?: {key: string, name: string}[],
  timeframe?: {key: string, name: string}[],
  selectedTimeframe?: string,
  selectedColPreset?: string | null,
  onTableDeleteClick?: (key: string) => void,
  onTimeframeClick?: (key: string) => void,
  onColumnPresetClick?: (key: string) => void,
  onTableSaveClick?: () => void
  onFontSizeChange?: (type: '+' | '-') => void,
  onTableColumnSelect: ListSelectEventHandler,
  resetFilters: () => void,
}

type GetMenuProps = Omit<Props, 'selectedCols'> & {
  name: TableOptionsMenuNames | null
  selectedColIds: string[],
  handleClose: () => void,
}

const getMenu = ({
  name,
  selectedColIds,
  categorizedColumns,
  columnPresets,
  selectedColPreset,
  timeframe,
  selectedTimeframe,
  onTableDeleteClick,
  onTimeframeClick,
  onTableSaveClick,
  onFontSizeChange,
  handleClose,
  resetFilters,
  onColumnPresetClick,
  onTableColumnSelect,
}: GetMenuProps) => {
  switch (name) {
    case TableOptionsMenuNames.settings:
      return (
        <TableConfigMenu
          handleClose={handleClose}
          resetFilters={resetFilters}
          onTableSaveClick={onTableSaveClick}
          onFontSizeChange={onFontSizeChange}
        />
      );
    case TableOptionsMenuNames.columns:
      return (
        <NestedCheckboxList
          initChecked={selectedColIds}
          values={categorizedColumns}
          onChange={onTableColumnSelect}
          listStyles={{ minHeight: '400px' }}
        />
      );
    case TableOptionsMenuNames.columnPresets:
      return (
        <TableColumnPresetMenu
          columnPresets={columnPresets}
          handleClose={handleClose}
          selectedColPreset={selectedColPreset}
          onTableDeleteClick={onTableDeleteClick}
          onColumnPresetClick={onColumnPresetClick}
        />
      );
    case TableOptionsMenuNames.timeFrames:
      return (
        <TableTimeFrameMenu
          timeframes={timeframe}
          handleClose={handleClose}
          selectedTimeframe={selectedTimeframe}
          onTimeframeClick={onTimeframeClick}
        />
      );
    default:
      return null;
  }
};

export const TableOptionsBar = ({
  selectedCols,
  categorizedColumns,
  columnPresets,
  selectedColPreset,
  timeframe,
  selectedTimeframe,
  onFontSizeChange,
  onTimeframeClick,
  onTableDeleteClick,
  onTableSaveClick,
  onColumnPresetClick,
  onTableColumnSelect,
  resetFilters,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuName, setMenuName] = useState<TableOptionsMenuNames | null>(null);
  const selectedColIds = useMemo(() => (selectedCols || []).map((c) => c.key.toString()), [selectedCols]);

  const open = Boolean(anchorEl);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const name = target.getAttribute('data-name') as TableOptionsMenuNames | null;
    if (name) {
      setMenuName(name);
      setAnchorEl(e.currentTarget);
    }
  }, []);
  const handleClose = useCallback(() => {
    setMenuName(null);
    setAnchorEl(null);
  }, []);

  return (
    <>
      <div style={{ width: '100%' }}>
        <Paper
            elevation={0}
            sx={{
              bgcolor: TABLE_OPTIONS_BG,
              display: 'flex',
              flexWrap: 'wrap',
              padding: '0.2rem',
              borderRadius: '4px 4px 0 0',
              color: TABLE_OPTIONS_FONT_COLOR,
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
                backgroundColor: TABLE_OPTIONS_BG_HOVER,
              },
            }}
          >
          <div className={classes.Right}>
            <TableOptionsButtons
              handleClick={handleClick}
              hasTimeFrames={!!timeframe?.length}
              hasColumnPresets={!!columnPresets?.length}
              open={open}
            />
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
        {
          getMenu({
            name: menuName,
            categorizedColumns,
            selectedColIds,
            columnPresets,
            selectedColPreset,
            timeframe,
            selectedTimeframe,
            onTimeframeClick,
            onFontSizeChange,
            onTableDeleteClick,
            onTableSaveClick,
            onColumnPresetClick,
            handleClose,
            onTableColumnSelect,
            resetFilters,
          })
        }
      </MenuBase>
    </>
  );
};

