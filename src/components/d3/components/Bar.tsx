import { isEqual } from 'lodash';
import {
  useEffect,
  useRef,
} from 'react';
import Bar, { ID3Bar } from '@frameworks/d3/chartElements/Bar/Bar';
import D3ScaleColorSequential from '@frameworks/d3/Scales/ScaleColorSequential';
import D3ScaleOrdinal from '@frameworks/d3/Scales/ScaleOrdinal';
import { typedMemo } from '@utils/React/typedMemo';
import type { D3ScaleLinear } from '@frameworks/d3/Scales';
import type D3ScaleBand from '@frameworks/d3/Scales/ScaleBand';
import {
  D3ContextGetScales,
  useD3Context,
} from '../context/D3Context';

type ReactBarProps<
D extends Record<string, unknown>,
> = Expand<Omit<ID3Bar<D>, 'xScale' | 'yScale' | 'chart' | 'colorScale'> & {
  yAxisId?: string,
  xAxisId?: string
  colorScaleId?: string,
}>

const getBarScales = (
  {
    yAxisId,
    xAxisId,
    colorScaleId,
  }:{
    yAxisId?: string,
    xAxisId?: string,
    colorScaleId?: string
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

  const colorScale = getScale({
    id: colorScaleId,
    mightNotExist: true,
  })as D3ScaleOrdinal<any> | D3ScaleColorSequential<any>;

  return {
    xScale,
    yScale,
    colorScale,
  };
};

const ReactD3Bar = typedMemo(<
D extends Record<string, unknown>,
>({
    data,
    xKey,
    yKey,
    colorKey,
    dataJoinKey,
    crosshair,
    disableZoom,
    transitionMs,
    formatCrosshair,
    fill,
    fillOpacity,
    stroke,
    strokeWidth,
    strokeOpacity,
    mouseOver,
    mouseOut,
    yAxisId,
    xAxisId,
    colorScaleId,
  }: ReactBarProps<D>,
  ) => {
  const bar = useRef<Bar<D> | null>(null);
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
        colorScale,
      } = getBarScales({
        xAxisId,
        yAxisId,
        colorScaleId,
      }, getScale);

      bar.current = new Bar({
        chart,
        data,
        xKey,
        yKey,
        xScale,
        yScale,
        colorScale,
        colorKey,
        dataJoinKey,
        crosshair,
        disableZoom,
        transitionMs,
        formatCrosshair,
        fill,
        fillOpacity,
        stroke,
        strokeWidth,
        strokeOpacity,
        mouseOver,
        mouseOut,
      });
    }
  }, [
    chart,
    data,
    xKey,
    yKey,
    scales,
    colorKey,
    dataJoinKey,
    crosshair,
    disableZoom,
    transitionMs,
    formatCrosshair,
    fill,
    fillOpacity,
    stroke,
    strokeWidth,
    strokeOpacity,
    mouseOver,
    mouseOut,
    yAxisId,
    xAxisId,
    colorScaleId,
    getScale,
  ]);

  useEffect(() => {
    if (chart && bar.current && scales.length && dims) {
      bar.current.update().all();
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
  const keys = Array.from(new Set([...Object.keys(prev), ...Object.keys(next)])) as (keyof ReactBarProps<any>)[];
  for (const key of keys) {
    if (key === 'dataJoinKey') {
      if (
        typeof prev.dataJoinKey === 'function'
        && typeof next.dataJoinKey === 'function'
      ) {
        if (prev.dataJoinKey.toString() !== next.dataJoinKey.toString()) return false;
        continue;
      }

      if (!isEqual(prev.dataJoinKey, next.dataJoinKey)) return false;
      continue;
    }

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

(ReactD3Bar as React.FC).displayName = 'ReactD3Bar';
export default ReactD3Bar;
