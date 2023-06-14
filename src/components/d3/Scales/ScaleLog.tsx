import { isEqual } from 'lodash';
import {
  useEffect,
  useRef,
} from 'react';
import { D3DataLinear } from '@frameworks/d3/dataTypes';
import D3ScaleLog, {
  IScaleLog,
  IScaleLogNoData,
  IScaleLogWithData,
} from '@frameworks/d3/Scales/ScaleLog';
import { D3NumberKey } from '@frameworks/d3/types';
import { typedMemo } from '@utils/React/typedMemo';
import type { ID3Axis } from '@frameworks/d3/Axes/Axis';
import { useD3Context } from '../context/D3Context';

type ReactD3ScaleLogProps<
D extends Record<string, unknown>,
> = Expand<
(PartialK<IScaleLogWithData<D>, 'id'> | PartialK<IScaleLogNoData, 'id'>)
& PartialK<Omit<ID3Axis, 'parent' | 'scale' | 'chart'>, 'id'>
>

const ReactD3ScaleLog = typedMemo(<
D extends Record<string, unknown>
>({
    id,
    data,
    base,
    dataKey,
    domain,
    roundDomain,
    type,
    label,
    tickValues,
    ticks,
    tickFormat,
  }: ReactD3ScaleLogProps<D>) => {
  const scaleId = useRef(id || 'log-scale');
  const {
    chart,
    scales,
    dims,
    getScale,
    addScale,
  } = useD3Context();

  useEffect(() => {
    if (chart) {
      const scale = new D3ScaleLog({
        id: scaleId.current,
        chart,
        base,
        ticks,
        data: data as D3DataLinear<D>[],
        dataKey: dataKey as D3NumberKey<D>,
        domain,
        roundDomain,
        type,
        label,
        tickValues,
        tickFormat,
      } as IScaleLog<D>);
      addScale(scale);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]);

  useEffect(() => {
    if (chart && scales.length) {
      const scale = getScale({ id: scaleId.current }) as D3ScaleLog<D>;
      scale.updateScale({
        chart,
        type,
        label,
        id: scaleId.current,
        data: data as D3DataLinear<D>[],
        dataKey: dataKey as D3NumberKey<D>,
        domain,
      } as IScaleLog<D>);
    }
  }, [
    chart,
    data,
    dims,
    scales,
    dataKey,
    domain,
    label,
    type,
    getScale,
  ]);

  return null;
}, (prev, next) => {
  const keys = Array.from(new Set([...Object.keys(prev), ...Object.keys(next)])) as (keyof ReactD3ScaleLogProps<any>)[];
  for (const key of keys) {
    if (key === 'domain') {
      if (!isEqual(prev.domain, next.domain)) return false;
      continue;
    }

    if (key === 'dataKey') {
      if (!isEqual(prev.dataKey, next.dataKey)) return false;
      continue;
    }

    if (key === 'tickValues') {
      if (!isEqual(prev.tickValues, next.tickValues)) return false;
      continue;
    }

    if (key === 'tickFormat') {
      if (prev.tickFormat?.toString() !== next.tickFormat?.toString()) return false;
      continue;
    }

    if (prev[key] !== next[key]) {
      return false;
    }
  }

  return true;
});

(ReactD3ScaleLog as React.FC).displayName = 'ReactD3ScaleLog';
export default ReactD3ScaleLog;

