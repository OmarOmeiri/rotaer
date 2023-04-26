import React, { useCallback, useState } from 'react';
import ListIcon from '@icons/list.svg';
import { ChartLegend } from '../ChartLegend/ChartLegend';
import { Drawer } from '../Drawer/ContainedDrawer';
import classes from './ChartGrid.module.css';
import { ChartGridButton } from './ChartGridButton';
import { ChartGridProps, ChartGrid } from './ChartGrid';

type ChildProps<T extends (...args: any) => any> = Parameters<T>[number]

export type ChartGridWithCollapsibleLegendProps = Expand<{
  legendItems: ChildProps<typeof ChartLegend>['items'];
  onLegendClick: ChildProps<typeof ChartLegend>['onClick'];
  legendItemType?: ChildProps<typeof ChartLegend>['type'];
} &
  ChartGridProps
>;

export const ChartGridWithCollapsibleLegend = ({
  itemMinWidth,
  children,
  legendItems,
  onLegendClick,
  legendItemType,
  gap,
}: ChartGridWithCollapsibleLegendProps) => {
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
        <ChartLegend
          items={legendItems}
          onClick={onLegendClick}
          type={legendItemType || 'square'} />
      </Drawer>
    </div>
  );
};
