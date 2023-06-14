import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { typedMemo } from '@utils/React/typedMemo';
import {
  D3ContextGetScales,
  useD3Context,
} from '../context/D3Context';
import VLine, { ID3VLine, ID3VLineSerie } from '../../../frameworks/d3/chartElements/Line/VLine';
import { D3AxedScales } from '../../../frameworks/d3/Scales/types';
import Portal from '../../../hoc/portal/Portal';

type ReactVLineProps<
D extends Record<string, unknown>,
> = Expand<Omit<ID3VLine<D>, 'xScale' | 'yScale' | 'chart' | 'colorScale'> & {
  xAxisId?: string,
  tooltipFormat: (d: ID3VLineSerie) => string | JSX.Element
}>

const getVLineScales = (
  {
    xAxisId,
  }:{
    xAxisId?: string,
  },
  getScale: D3ContextGetScales,
) => {
  const xScale = getScale({
    id: xAxisId,
    type: 'x',
  }) as D3AxedScales<any>;

  return xScale;
};

const ReactD3VLine = typedMemo(<
D extends Record<string, unknown>,
>({
    series,
    transitionMs,
    mouseOver,
    mouseOut,
    mouseMove,
    tooltipFormat,
    xAxisId,
  }: ReactVLineProps<D>,
  ) => {
  const vline = useRef<VLine<D> | null>(null);
  const [over, setOver] = useState<ID3VLineSerie | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<[number, number] | null>(null);
  const {
    chart,
    dims,
    scales,
    margin,
    updateChart,
    getScale,
  } = useD3Context();

  const onMouseOver = useCallback((d: ID3VLineSerie, position: [number, number]) => {
    setOver(d);
    setTooltipPosition(position);
    if (mouseOver) mouseOver(d, position);
  }, [mouseOver]);

  const onMouseMove = useCallback((position: [number, number]) => {
    setTooltipPosition(position);
    if (mouseMove) mouseMove(position);
  }, [mouseMove]);

  const onMouseOut = useCallback(() => {
    setOver(null);
    setTooltipPosition(null);
    if (mouseOut) mouseOut();
  }, [mouseOut]);

  useEffect(() => {
    if (chart && scales.length) {
      const xScale = getVLineScales({
        xAxisId,
      }, getScale);

      vline.current = new VLine({
        series,
        chart,
        xScale,
        transitionMs,
        mouseOver: onMouseOver,
        mouseOut: onMouseOut,
        mouseMove: onMouseMove,
      });
    }
  }, [
    chart,
    scales,
    series,
    xAxisId,
    transitionMs,
    onMouseOver,
    onMouseOut,
    onMouseMove,
    getScale,
  ]);

  useEffect(() => {
    if (chart && vline.current && scales.length && dims) {
      vline.current.update().all();
    }
  }, [
    chart,
    scales,
    dims,
    margin,
    updateChart,
  ]);

  if (over && tooltipPosition) {
    return (
      <Portal id='overlay-tooltip'>
        <div style={{
          position: 'absolute',
          top: `${tooltipPosition[1]}px`,
          left: `${tooltipPosition[0]}px`,
          zIndex: '3',
          pointerEvents: 'none',
        }}>
          {tooltipFormat(over)}
        </div>
      </Portal>
    );
  }

  return null;
}, (prev, next) => {
  const keys = Array.from(new Set([...Object.keys(prev), ...Object.keys(next)])) as (keyof ReactVLineProps<any>)[];
  for (const key of keys) {
    if (prev[key] !== next[key]) {
      return false;
    }
  }

  return true;
});

(ReactD3VLine as React.FC).displayName = 'ReactD3Bar';
export default ReactD3VLine;
