import {
  useEffect,
  useRef,
} from 'react';
import Line, { ID3Line } from '@frameworks/d3/chartElements/Line/Line';
import { typedMemo } from '@utils/React/typedMemo';
import type { D3ScaleLinear } from '@frameworks/d3/Scales';
import type D3ScaleBand from '@frameworks/d3/Scales/ScaleBand';
import {
  D3ContextGetScales,
  useD3Context,
} from '../context/D3Context';

type ReactD3LineProps<
D extends Record<string, unknown>,
> = Expand<Omit<
ID3Line<D>
, 'xScale' | 'colorScale' | 'yScale' | 'chart' | 'type'
> & {
  yAxisId?: string,
  xAxisId?: string,
  colorScaleId?: string,
}>

const getLineScales = (
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
  }) as D3ScaleLinear<any> | D3ScaleBand<any>;
  const xScale = getScale({
    id: xAxisId,
    type: 'x',
  }) as D3ScaleLinear<any> | D3ScaleBand<any>;

  return {
    xScale,
    yScale,
  };
};

const ReactD3Line = typedMemo(<
D extends Record<string, unknown>,
>({
    data,
    filter,
    series,
    alpha = 0.5,
    transitionMs,
    withDots,
    mouseOut,
    mouseMove,
    mouseOver,
    disableZoom,
    crosshair,
    yAxisId,
    xAxisId,
    colorScaleId,
    formatCrosshair,
    curve,
  }: ReactD3LineProps<D>) => {
  const line = useRef<Line<D> | null>(null);
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
      } = getLineScales({
        xAxisId,
        yAxisId,
      }, getScale);

      line.current = new Line({
        chart,
        xScale,
        yScale,
        data,
        alpha,
        series,
        withDots,
        filter,
        transitionMs,
        disableZoom,
        crosshair,
        formatCrosshair,
        mouseOut,
        mouseMove,
        mouseOver,
        curve,
      });
    }
  }, [
    chart,
    scales,
    alpha,
    data,
    series,
    filter,
    withDots,
    formatCrosshair,
    transitionMs,
    disableZoom,
    crosshair,
    mouseOut,
    mouseMove,
    mouseOver,
    xAxisId,
    yAxisId,
    getScale,
    curve,
  ]);

  useEffect(() => {
    if (chart && scales.length && line.current && dims) {
      line.current.update().all();
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
  const keys = Array.from(new Set([...Object.keys(prev), ...Object.keys(next)])) as (keyof ReactD3LineProps<any>)[];
  for (const key of keys) {
    if (key === 'formatCrosshair') {
      if (
        prev?.formatCrosshair?.x?.toString() !== next?.formatCrosshair?.x?.toString()
        || prev?.formatCrosshair?.y?.toString() !== next?.formatCrosshair?.y?.toString()
      ) return false;
      continue;
    }

    if (key === 'curve') {
      if (
        prev?.curve?.toString() !== next?.curve?.toString()
      ) return false;
      continue;
    }

    if (prev[key] !== next[key]) {
      return false;
    }
  }

  return true;
});

(ReactD3Line as React.FC).displayName = 'ReactD3Line';
export default ReactD3Line;
