import React, {
  forwardRef,
  memo,
} from 'react';
import { Input } from '@/components/Forms/Input';
import { TooltipClick } from '@/components/Tooltips/TooltipClick';
import Controls from '@assets/icons/controls.svg';
import { TableStyles } from '../../../styles';
import { StyledTableTip } from './StyledTip';
import classes from './TableTooltips.module.css';
import { TableTooltipWrapper } from './TooltipWrapper';

type Props = {
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  applied: boolean,
  dataKey: string,
  value: string,
  iconStyle?: DeepPartial<TableStyles['header']['controlIcons']>
}

const Tip = memo(forwardRef(({
  dataKey,
  value,
  onChange,
}: Omit<Props, 'applied' | 'name'>, ref: React.ForwardedRef<HTMLInputElement>) => (
  <StyledTableTip>
    <Input
      styleType='transparent'
      name={dataKey}
      value={value}
      onChange={onChange}
      ref={ref}
      // debounce={1000}
    />
  </StyledTableTip>
)));

export const TextFilterTooltip = forwardRef(({
  dataKey,
  value,
  applied,
  iconStyle,
  onChange,
}: Props, ref: React.ForwardedRef<any>) => {
  const inputRef = (elm: HTMLInputElement) => {
    if (elm) elm.focus();
  };
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <TooltipClick
      tooltip={
        <Tip
          dataKey={dataKey}
          value={value}
          onChange={onChange}
          ref={inputRef}
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
