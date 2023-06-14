import { isEqual } from 'lodash';
import {
  useEffect,
  useRef,
} from 'react';
import Circle, { ID3Circle } from '@frameworks/d3/chartElements/Circle/Circle';
import { typedMemo } from '@utils/React/typedMemo';
import type D3ScaleOrdinal from '@frameworks/d3/Scales/ScaleOrdinal';
import type { D3ScaleLinear } from '@frameworks/d3/Scales';
import type D3ScaleBand from '@frameworks/d3/Scales/ScaleBand';
import {
  D3ContextGetScales,
  useD3Context,
} from '../context/D3Context';

type ReactCircleProps<
D extends Record<string, unknown>,
> = Expand<Omit<
ID3Circle<D>
, 'xScale' | 'colorScale' | 'yScale' | 'chart'
> & {
  yAxisId?: string,
  xAxisId?: string,
  colorScaleId?: string,
}>

const getCircleScales = (
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
  }) as D3ScaleLinear<any> | D3ScaleBand<any>;
  const xScale = getScale({
    id: xAxisId,
    type: 'x',
  }) as D3ScaleLinear<any> | D3ScaleBand<any>;

  const colorScale = getScale({
    id: colorScaleId,
    mightNotExist: true,
  })as D3ScaleOrdinal<any>;

  return {
    xScale,
    yScale,
    colorScale,
  };
};

const ReactD3Circle = typedMemo(<
D extends Record<string, unknown>,
>({
    data,
    filter,
    colorKey,
    xKey,
    yKey,
    rKey,
    radius,
    radiusNorm,
    dataJoinKey,
    fill,
    fillOpacity,
    stroke,
    strokeWidth,
    transitionMs,
    mouseOut,
    mouseMove,
    mouseOver,
    yAxisId,
    xAxisId,
    colorScaleId,
    disableZoom,
  }: ReactCircleProps<D>) => {
  const circle = useRef<Circle<D> | null>(null);
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
      } = getCircleScales({
        xAxisId,
        yAxisId,
        colorScaleId,
      }, getScale);

      circle.current = new Circle({
        chart,
        xScale,
        yScale,
        colorScale,
        colorKey,
        data,
        filter,
        xKey,
        yKey,
        rKey,
        radius,
        radiusNorm,
        fillOpacity,
        dataJoinKey,
        fill,
        stroke,
        strokeWidth,
        transitionMs,
        mouseOut,
        mouseMove,
        mouseOver,
        disableZoom,
      });
    }
  }, [
    chart,
    scales,
    data,
    colorKey,
    filter,
    xKey,
    yKey,
    rKey,
    radius,
    radiusNorm,
    dataJoinKey,
    fill,
    fillOpacity,
    stroke,
    strokeWidth,
    yAxisId,
    xAxisId,
    colorScaleId,
    transitionMs,
    getScale,
    mouseOut,
    mouseMove,
    mouseOver,
  ]);

  useEffect(() => {
    if (chart && scales.length && circle.current && dims) {
      circle.current.update().all();
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
  const keys = Array.from(new Set([...Object.keys(prev), ...Object.keys(next)])) as (keyof ReactCircleProps<any>)[];
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

    if (prev[key] !== next[key]) {
      return false;
    }
  }

  return true;
});

(ReactD3Circle as React.FC).displayName = 'ReactD3Circle';
export default ReactD3Circle;
