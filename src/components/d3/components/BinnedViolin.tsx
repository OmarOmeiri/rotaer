import {
  useEffect,
  useRef,
} from 'react';
import BinnedViolin, { ID3BinnedViolin } from '@frameworks/d3/chartElements/Violin/BinnedViolin';
import { typedMemo } from '@utils/React/typedMemo';

import type { D3ScaleLinear } from '@frameworks/d3/Scales';
import type D3ScaleBand from '@frameworks/d3/Scales/ScaleBand';
import {
  D3ContextGetScales,
  useD3Context,
} from '../context/D3Context';

type ReactD3BinnedViolinProps<
D extends Record<string, [number, number][]>,
> = Expand<Omit<
ID3BinnedViolin<D>
, 'xScale' | 'colorScale' | 'yScale' | 'chart'
> & {
  yAxisId?: string,
  xAxisId?: string,
}>

const getViolinScales = (
  {
    yAxisId,
    xAxisId,
  }:{
    yAxisId?: string,
    xAxisId?: string,
  },
  getScale: D3ContextGetScales,
) => {
  const yScale = getScale({
    id: yAxisId,
    type: 'y',
  }) as D3ScaleLinear<any>;
  const xScale = getScale({
    id: xAxisId,
    type: 'x',
  }) as D3ScaleBand<any>;

  return {
    xScale,
    yScale,
  };
};

const ReactD3BinnedViolin = typedMemo(<
D extends Record<string, [number, number][]>,
>({
    data,
    series,
    yAxisId,
    xAxisId,
    disableZoom,
    transitionMs,
    crosshair,
  }: ReactD3BinnedViolinProps<D>) => {
  const violin = useRef<BinnedViolin<D> | null>(null);
  const {
    chart,
    dims,
    scales,
    margin,
    updateChart,
    getScale,
  } = useD3Context();

  useEffect(() => {
    if (chart && scales.length) {
      const {
        yScale,
        xScale,
      } = getViolinScales({
        xAxisId,
        yAxisId,
      }, getScale);
      violin.current = new BinnedViolin({
        chart,
        yScale,
        xScale,
        data,
        series,
        crosshair,
        disableZoom,
        transitionMs,
      });
    }
  }, [
    chart,
    scales,
    data,
    series,
    yAxisId,
    xAxisId,
    disableZoom,
    crosshair,
    transitionMs,
    getScale,
  ]);

  useEffect(() => {
    if (chart && scales.length && violin.current && dims) {
      violin.current.update().all();
    }
  }, [
    chart,
    scales,
    dims,
    margin,
    updateChart,
  ]);

  return null;
}, (prev, next) => {
  const keys = Array.from(new Set([...Object.keys(prev), ...Object.keys(next)])) as (keyof ReactD3BinnedViolinProps<any>)[];
  for (const key of keys) {
    if (key === 'formatCrosshair') {
      if (
        prev?.formatCrosshair?.x?.toString() !== next?.formatCrosshair?.x?.toString()
        || prev?.formatCrosshair?.y?.toString() !== next?.formatCrosshair?.y?.toString()
      ) return false;
      continue;
    }

    if (prev[key] !== next[key]) {
      return false;
    }
  }

  return true;
});

(ReactD3BinnedViolin as React.FC).displayName = 'ReactD3Violin';
export default ReactD3BinnedViolin;
