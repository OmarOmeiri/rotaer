import React from 'react';
import { ChartLegend } from '../ChartLegend/ChartLegend';
import classes from './ChartGrid.module.css';
import { ChartGrid, ChartGridProps } from './ChartGrid';

type ChildProps<T extends (...args: any) => any> = Parameters<T>[number]

export type ChartGridWithLegendProps = Expand<{
  legendItems: ChildProps<typeof ChartLegend>['items'],
  maxLegendHeight: ChildProps<typeof ChartLegend>['maxHeight'],
  onLegendClick: ChildProps<typeof ChartLegend>['onClick'],
  legendItemType?: ChildProps<typeof ChartLegend>['type'],
}
& ChartGridProps
>

export const ChartGridWithLegend = ({
  itemMinWidth,
  children,
  legendItems,
  maxLegendHeight,
  onLegendClick,
  legendItemType,
  gap,
}: ChartGridWithLegendProps) => (
  <div className={classes.GridWithLegend}>
    <ChartGrid itemMinWidth={itemMinWidth} gap={gap}>
      {children}
    </ChartGrid>
    <ChartLegend
      items={legendItems}
      maxHeight={maxLegendHeight}
      onClick={onLegendClick}
      type={legendItemType || 'square'} />
  </div>
);
