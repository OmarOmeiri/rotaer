import { roundToMultiple } from 'lullo-utils/Math';
import React, {
  forwardRef,
  memo,
  useCallback,
} from 'react';
import Controls from '@assets/icons/controls.svg';
import MultiRangeSlider from '@/components/RangeSlider/MultiRangeSlider';
import { TooltipClick } from '@/components/Tooltips/TooltipClick';
import { TableStyles } from '../../../styles';
import { StyledTableTip } from './StyledTip';
import classes from './TableTooltips.module.css';
import { TableTooltipWrapper } from './TooltipWrapper';

// const DensityChart = dynamic(() => import('@frameworks/recharts/Density'), { ssr: false });

type Props = {
  onChange: RangeSliderEventHandler,
  applied: boolean,
  name: string,
  dataKey: string,
  value: NumericFilter['value'],
  min: number,
  max: number,
  iconStyle?: DeepPartial<TableStyles['header']['controlIcons']>
  bins: [number, number][]
}

const Tip = memo(({
  name,
  dataKey,
  value,
  min,
  max,
  bins,
  onChange,
}: Omit<Props, 'applied'>) => {
  const rng = max - min;
  let mult = 1;
  if (rng >= 100) mult = 10;
  else if (rng >= 50) mult = 5;
  const roundedMin = rng > 10 ? roundToMultiple(min, mult, 'floor') : min;
  const roundedMax = rng > 10 ? roundToMultiple(max, mult, 'ceil') : max;
  return (
    <StyledTableTip>
      <div className={classes.ChartWrapper}>
        {/* <DensityChart
        data={bins}
        axis={{
          y: {
            hide: true,
          },
        }}
        grid={false}
        ticks={{
          x: {
            size: 4,
            tickProps: {
              fontSize: '0.7rem',
            },
          },
        }}
        tooltip={{
          xLabel: name,
        }}
      /> */}
      </div>
      <div>
        <MultiRangeSlider
          min={roundedMin}
          max={roundedMax}
          name={dataKey}
          value={value}
          onChange={onChange}
        />
      </div>
    </StyledTableTip>
  );
});

export const NumericFilterTooltip = forwardRef(({
  dataKey,
  name,
  value,
  applied,
  min,
  max,
  bins,
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
          name={name}
          min={min}
          max={max}
          bins={bins}
          value={value}
          dataKey={dataKey}
          onChange={onChange}
        />
    }
      className={classes.Tip}
      onClick={onClick}
      ref={ref}>
      <TableTooltipWrapper applied={applied} className={classes.Wrapper} iconStyle={iconStyle}>
        <Controls/>
      </TableTooltipWrapper>
    </TooltipClick>
  );
});
