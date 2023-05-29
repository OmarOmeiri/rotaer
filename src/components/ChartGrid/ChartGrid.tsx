import isEqual from 'lodash/isEqual';
import React from 'react';
import { typedMemo } from '@/utils/React/typedMemo';
import ResponsiveGrid from '../Grid/Grid';

type ChildProps<T extends (...args: any) => any> = Parameters<T>[number]

export type ChartGridProps = {
  itemMinWidth: ChildProps<typeof ResponsiveGrid>['minWidth'],
  children: React.ReactNode
  gap?: {h?: string, v?: string}
}

export const ChartGrid = typedMemo(({
  itemMinWidth,
  children,
  gap,
}: ChartGridProps) => (
  <ResponsiveGrid minWidth={itemMinWidth} gap={gap}>
    {children}
  </ResponsiveGrid>
), (prev, next) => {
  const keys = Array.from(new Set([...Object.keys(prev), ...Object.keys(next)])) as (keyof ChartGridProps)[];
  for (const key of keys) {
    if (key === 'gap') {
      if (!isEqual(prev.gap, next.gap)) return false;
      continue;
    }

    if (prev[key] !== next[key]) {
      return false;
    }
  }

  return true;
});

