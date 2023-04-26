import { forwardRef, memo, useCallback } from 'react';
import Controls from '@assets/icons/controls.svg';
import CheckboxList from '../../../../List/CheckboxList';
import { TooltipClick } from '../../../../Tooltips/TooltipClick';
import { StyledTableTip } from './StyledTip';
import classes from './TableTooltips.module.css';
import Config from '../../../../../config';
import { TableTooltipWrapper } from './TooltipWrapper';
import { TableStyles } from '../../../styles';

type Props = {
  onChange: ListSelectEventHandler,
  applied: boolean,
  dataKey: string,
  values: CategoricalFilter['value'],
  iconStyle?: DeepPartial<TableStyles['header']['controlIcons']>
}
const { colors } = Config.get('styles');

const Tip = memo(({
  dataKey,
  values,
  onChange,
}: Omit<Props, 'applied' | 'name'>) => (
  <StyledTableTip>
    <CheckboxList name={dataKey} values={values || []} listItemStyles={{ color: colors.white }} onChange={onChange}/>
  </StyledTableTip>
));

export const CategoricalFilterTooltip = forwardRef(({
  dataKey,
  values,
  applied,
  iconStyle,
  onChange,
}: Props, ref: React.ForwardedRef<any>) => {
  const onClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);
  return (
    <TooltipClick
      tooltip={
        <Tip
          dataKey={dataKey}
          values={values}
          onChange={onChange}
        />
      }
      className={classes.Tip}
      onClick={onClick}
      ref={ref}
    >
      <TableTooltipWrapper applied={applied} className={classes.Wrapper} iconStyle={iconStyle}>
        <Controls/>
      </TableTooltipWrapper>
    </TooltipClick>
  );
});
