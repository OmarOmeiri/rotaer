import React, { useCallback, useState } from 'react';
import ListIcon from '@icons/list.svg';
import { Drawer } from '../Drawer/ContainedDrawer';
import classes from './ChartGrid.module.css';
import { ChartGridButton } from './ChartGridButton';
import { ChartGridProps, ChartGrid } from './ChartGrid';
import { CategorizedChartLegend } from '../ChartLegend/ChartLegendCategorized';

type ChildProps<T extends (...args: any) => any> = Parameters<T>[number]

type ChartGridWithCategorizedLegendProps = Expand<{
  legendItems: ChildProps<typeof CategorizedChartLegend>['items'];
  onLegendClick: ChildProps<typeof CategorizedChartLegend>['onClick'];
  legendItemType?: ChildProps<typeof CategorizedChartLegend>['type'];
} &
  ChartGridProps
>;

export const ChartGridWithCategorizedLegend = ({
  itemMinWidth,
  children,
  legendItems,
  onLegendClick,
  legendItemType,
  gap,
}: ChartGridWithCategorizedLegendProps) => {
  const [legendOpen, setLegendOpen] = useState(false);

  const toggleLegendOpen = useCallback(() => {
    setLegendOpen((open) => !open);
  }, []);

  return (
    <div className={classes.GridWithLegend}>
      <ChartGrid itemMinWidth={itemMinWidth} gap={gap}>
        {children}
      </ChartGrid>
      <div className={classes.BtnContainer}>
        <ChartGridButton onClick={toggleLegendOpen}>
          <ListIcon />
        </ChartGridButton>
      </div>
      <Drawer open={legendOpen} setOpen={setLegendOpen}>
        <CategorizedChartLegend
          items={legendItems}
          onClick={onLegendClick}
          type={legendItemType || 'square'} />
      </Drawer>
    </div>
  );
};
