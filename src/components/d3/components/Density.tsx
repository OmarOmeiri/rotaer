import {
  useEffect,
  useRef,
} from 'react';
import Density, { ID3Density } from '@frameworks/d3/chartElements/Density/Density';
import { typedMemo } from '@utils/React/typedMemo';
import type { D3ScaleLinear } from '@frameworks/d3/Scales';
import type D3ScaleBand from '@frameworks/d3/Scales/ScaleBand';
import {
  D3ContextGetScales,
  useD3Context,
} from '../context/D3Context';

type ReactD3DensityProps<
D extends Record<string, [number, number][]>,
> = Expand<Omit<
ID3Density<D>
, 'xScale' | 'colorScale' | 'yScale' | 'chart' | 'type'
> & {
  yAxisId?: string,
  xAxisId?: string,
}>

const getAreaScales = (
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

const ReactD3Density = typedMemo(<
D extends Record<string, [number, number][]>,
>({
    data,
    series,
    curve,
    transitionMs,
    withDots,
    mouseOut,
    mouseMove,
    mouseOver,
    disableZoom,
    crosshair,
    yAxisId,
    xAxisId,
    formatCrosshair,
  }: ReactD3DensityProps<D>) => {
  const area = useRef<Density<D> | null>(null);
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
      } = getAreaScales({
        xAxisId,
        yAxisId,
      }, getScale);

      area.current = new Density({
        chart,
        xScale,
        yScale,
        data,
        series,
        withDots,
        transitionMs,
        disableZoom,
        crosshair,
        formatCrosshair,
        curve,
        mouseOut,
        mouseMove,
        mouseOver,
      });
    }
  }, [
    chart,
    scales,
    curve,
    data,
    series,
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
  ]);

  useEffect(() => {
    if (chart && scales.length && area.current && dims) {
      area.current.update().all();
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
  const keys = Array.from(new Set([...Object.keys(prev), ...Object.keys(next)])) as (keyof ReactD3DensityProps<any>)[];
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

(ReactD3Density as React.FC).displayName = 'ReactD3Area';
export default ReactD3Density;
