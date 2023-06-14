import { ScaleBand } from 'd3';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { D3Scales } from '@frameworks/d3/Scales/types';
import { validateChildProps } from '@utils/React/validateChildProps';
import type D3Chart from '@frameworks/d3/Chart';
import type { D3Dimensions } from '@frameworks/d3/Dimensions';
import {
  D3ContextGetScales,
  useD3Context,
} from '../context/D3Context';
import { PortalByRef } from '../../../hoc/portal/PortalByRef';
import { getElmDimension } from '../../../utils/HTML/htmlPosition';

type ChartOverlayPositionH =
| 'left'
| 'right'
| 'center'
| 'inner-left'
| 'inner-right'
| 'inner-center'
| number;
type ChartOverlayPositionV =
| 'top'
| 'bottom'
| 'center'
| 'inner-top'
| 'inner-bottom'
| 'inner-center'
| number;

type ChartOverlayPositionScaled = number | Date | string;

interface ID3ChartOverlay {
  children: React.ReactElement<any> | React.ReactElement<any>[]
  overflow?: boolean
  clip?: 'leftright' | 'top' | 'bottom' | 'left' | 'right' | 'topbottom' | 'all'
}

type TD3ChartOverlayElementXYScaled = {
  position: {
    x: ChartOverlayPositionH | ChartOverlayPositionScaled,
    y: ChartOverlayPositionV | ChartOverlayPositionScaled,
  },
  dx?: number | ((dims: {width: number, height: number}) => number),
  dy?: number | ((dims: {width: number, height: number}) => number),
  xScaleId: string,
  yScaleId: string,
  children: React.ReactNode,
}

type TD3ChartOverlayElementYScaled = {
  position: {
    x: ChartOverlayPositionH,
    y: ChartOverlayPositionV | ChartOverlayPositionScaled,
  },
  dx?: number | ((dims: {width: number, height: number}) => number),
  dy?: number | ((dims: {width: number, height: number}) => number),
  xScaleId?: undefined,
  yScaleId: string,
  children: React.ReactNode,
}

export type TD3ChartOverlayElementXScaled = {
  position: {
    x: ChartOverlayPositionH | ChartOverlayPositionScaled,
    y: ChartOverlayPositionV,
  },
  dx?: number | ((dims: {width: number, height: number}) => number),
  dy?: number | ((dims: {width: number, height: number}) => number),
  xScaleId: string,
  yScaleId?: undefined,
  children: React.ReactNode,
}

type TD3ChartOverlayElementUnScaled = {
  position: {
    x: ChartOverlayPositionH,
    y: ChartOverlayPositionV,
  },
  dx?: number | ((dims: {width: number, height: number}) => number),
  dy?: number | ((dims: {width: number, height: number}) => number),
  xScaleId?: undefined,
  yScaleId?: undefined,
  children: React.ReactNode,
}

type TD3ChartOverlayElement = {
  position: {
    x: ChartOverlayPositionH | ChartOverlayPositionScaled,
    y: ChartOverlayPositionV | ChartOverlayPositionScaled,
  },
  dx?: number | ((dims: {width: number, height: number}) => number),
  dy?: number | ((dims: {width: number, height: number}) => number),
  xScaleId?: string,
  yScaleId?: string,
  children: React.ReactNode,
}

const chartOverlayElementStyle: React.CSSProperties = {
  overflow: 'visible',
  position: 'absolute',
  opacity: '0',
};

const clampPosition = (
  value: number,
  dims: D3Dimensions,
  node: HTMLDivElement,
  type: 'left' | 'top',
) => (
  type === 'left'
    ? Math.min(Math.max(value, 0), (dims.width - node.offsetWidth - 5))
    : Math.min(Math.max(value, 0), (dims.height - node.offsetHeight))
);

const getScaledValue = ({
  value,
  scale,
  node,
  type,
  chart,
}:{
  value: number | Date | string,
  scale: D3Scales<any>,
  node: HTMLDivElement,
  type: 'left' | 'top',
  chart: D3Chart,
}) => {
  const offset = (type === 'left'
    ? node.offsetWidth
    : node.offsetHeight) / 2;

  const margin = type === 'left'
    ? chart.dims.margin.left
    : chart.dims.margin.top;

  const scl = scale.getScale();
  const bandWidth = (('bandwidth' in scl)
    ? (scl as ScaleBand<any>).bandwidth()
    : 0) / 2;

  return Number(scl(value as any))
  + margin
  + bandWidth
  - offset;
};

const getPositionLeft = ({
  x,
  node,
  chart,
  scale,
}:{
  x: ChartOverlayPositionH | ChartOverlayPositionScaled,
  node: HTMLDivElement,
  chart: D3Chart,
  scale?: D3Scales<any>
}) => {
  if (typeof x === 'number' && !scale) {
    return clampPosition(x, chart.dims, node, 'left');
  }
  let left = 0;
  switch (x) {
    case 'left':
      left = 0;
      break;
    case 'inner-left':
      left = chart.dims.margin.left;
      break;
    case 'right':
      left = chart.dims.width;
      break;
    case 'inner-right':
      left = chart.dims.width - chart.dims.margin.right - node.offsetWidth;
      break;
    case 'center':
      left = (chart.dims.width / 2) - (node.offsetWidth / 2);
      break;
    case 'inner-center':
      left = (chart.dims.innerDims.width / 2) + chart.dims.margin.left - (node.offsetWidth / 2);
      break;
    default: {
      if (scale) {
        return clampPosition(
          getScaledValue({
            value: x,
            scale,
            chart,
            node,
            type: 'left',
          }),
          chart.dims,
          node,
          'left',
        );
      }
      throw new Error(`XScale not found: ${x}`);
    }
  }
  return clampPosition(left, chart.dims, node, 'left');
};

const getPositionTop = ({
  y,
  node,
  chart,
  scale,
}:{
  y: ChartOverlayPositionV | ChartOverlayPositionScaled,
  node: HTMLDivElement,
  scale?: D3Scales<any>,
  chart: D3Chart
}) => {
  if (typeof y === 'number' && !scale) {
    return clampPosition(y, chart.dims, node, 'top');
  }

  let top = 0;
  switch (y) {
    case 'top':
      top = chart.dims.margin.top - node.offsetHeight;
      break;
    case 'inner-top':
      top = chart.dims.margin.top;
      break;
    case 'bottom':
      top = chart.dims.height;
      break;
    case 'inner-bottom':
      top = chart.dims.height - chart.dims.margin.bottom - node.offsetHeight;
      break;
    case 'center':
      top = (chart.dims.height / 2) - (node.offsetHeight / 2);
      break;
    case 'inner-center':
      top = (chart.dims.innerDims.height / 2) + chart.dims.margin.top - (node.offsetHeight / 2);
      break;
    default: {
      if (scale) {
        return clampPosition(
          getScaledValue({
            value: y,
            scale,
            chart,
            node,
            type: 'top',
          }),
          chart.dims,
          node,
          'top',
        );
      }
      throw new Error(`yScale not found: ${y}`);
    }
  }
  return clampPosition(top, chart.dims, node, 'top');
};

const getElementPosition = ({
  node,
  getScale,
  chart,
  xScaleId,
  yScaleId,
  position,
  dx,
  dy,
}:{
  node: HTMLDivElement,
  getScale: D3ContextGetScales,
  xScaleId: string | undefined,
  yScaleId: string | undefined,
  chart: D3Chart,
  position: {
    x: string | number | Date;
    y: string | number | Date;
  }
  dx?: number | ((dims: {width: number, height: number}) => number),
  dy?: number | ((dims: {width: number, height: number}) => number),
}): {top: string, left: string, opacity: string} => {
  const xScale = xScaleId
    ? getScale({
      id: xScaleId,
      type: 'x',
    })
    : undefined;

  const yScale = yScaleId
    ? getScale({
      id: yScaleId,
      type: 'y',
    })
    : undefined;

  const top = getPositionTop({
    y: position.y, node, chart, scale: yScale,
  });
  const left = getPositionLeft({
    x: position.x, node, chart, scale: xScale,
  });

  let _dx: number;
  let _dy: number;
  const dims = getElmDimension(node);

  if (typeof dy === 'function') _dy = dy(dims);
  else _dy = dy || 0;

  if (typeof dx === 'function') _dx = dx(dims);
  else _dx = dx || 0;

  return {
    top: `${top - _dy}px`,
    left: `${left + _dx}px`,
    opacity: '1',
  };
};

function ReactD3ChartOverlayElementFRef(params: TD3ChartOverlayElementXYScaled, ref?: any): JSX.Element | null
function ReactD3ChartOverlayElementFRef(params: TD3ChartOverlayElementYScaled, ref?: any): JSX.Element | null
function ReactD3ChartOverlayElementFRef(params: TD3ChartOverlayElementXScaled, ref?: any): JSX.Element | null
function ReactD3ChartOverlayElementFRef(params: TD3ChartOverlayElementUnScaled, ref?: any): JSX.Element | null
// eslint-disable-next-line require-jsdoc
function ReactD3ChartOverlayElementFRef({
  position,
  xScaleId,
  yScaleId,
  children,
  dx,
  dy,
}: TD3ChartOverlayElement, ref?: any) {
  const localRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

  const [updt, setUpdt] = useState(false);
  const {
    dims,
    getScale,
    chart,
    updateChart,
  } = useD3Context();

  const refCb = useCallback((node: HTMLDivElement | null) => {
    if (node && dims && chart) {
      localRef.current = node;
      const {
        top,
        left,
        opacity,
      } = getElementPosition({
        node,
        getScale,
        xScaleId,
        yScaleId,
        chart,
        position,
        dx: dx || 0,
        dy: dy || 0,
      });
      node.style.top = top;
      node.style.left = left;
      node.style.opacity = opacity;
    }
  }, [
    position,
    dims,
    chart,
    getScale,
    yScaleId,
    xScaleId,
    dx,
    dy,
  ]);

  useEffect(() => {
    if (localRef.current && dims && chart) {
      const {
        top,
        left,
        opacity,
      } = getElementPosition({
        node: localRef.current,
        getScale,
        xScaleId,
        yScaleId,
        chart,
        position,
        dx: dx || 0,
        dy: dy || 0,
      });
      localRef.current.style.top = top;
      localRef.current.style.left = left;
      localRef.current.style.opacity = opacity;
    }
  }, [
    position,
    dims,
    chart,
    getScale,
    updateChart,
    yScaleId,
    xScaleId,
    updt,
    dx,
    dy,
  ]);

  const onZoom = useCallback(() => {
    setUpdt((s) => !s);
  }, []);

  useEffect(() => {
    if (chart) {
      chart.zoomSubscribe(onZoom);
    }
  }, [chart, onZoom]);

  if (!dims) return null;

  return (
    <div
      ref={refCb}
      style={chartOverlayElementStyle}>
      {children}
    </div>
  );
}

export const ReactD3ChartOverlayElement = forwardRef(ReactD3ChartOverlayElementFRef) as typeof ReactD3ChartOverlayElementFRef;

const getClip = (chart: D3Chart, clip: ID3ChartOverlay['clip'] = 'all') => {
  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;
  switch (clip) {
    case 'all':
      top = chart.dims.margin.top;
      right = chart.dims.margin.right + 5;
      bottom = chart.dims.margin.bottom;
      left = chart.dims.margin.left;
      break;
    case 'top':
      top = chart.dims.margin.top;
      break;
    case 'bottom':
      bottom = chart.dims.margin.bottom;
      break;
    case 'left':
      left = chart.dims.margin.left;
      break;
    case 'leftright':
      left = chart.dims.margin.left;
      right = chart.dims.margin.right;
      break;
    case 'right':
      right = chart.dims.margin.right;
      break;
    case 'topbottom':
      top = chart.dims.margin.top;
      bottom = chart.dims.margin.bottom;
      break;
    default:
      break;
  }
  return `inset(${
    top
  }px ${
    right + 5
  }px ${
    bottom
  }px ${
    left
  }px)`;
};

// eslint-disable-next-line require-jsdoc
function ReactD3ChartOverlay({
  children,
  overflow = false,
  clip,
}: ID3ChartOverlay) {
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  const overlayRef = useRef<null | HTMLDivElement>(null);
  const { ref, chart, dims } = useD3Context();
  useEffect(() => {
    validateChildProps(children, ['position']);
  }, [children]);

  useEffect(() => {
    if (wrapperRef.current && chart && !overflow) {
      wrapperRef.current.style.clipPath = getClip(chart, clip);
    }
  }, [ref, chart, dims, overflow, clip]);

  useEffect(() => {
    if (chart) {
      overlayRef.current = chart.chartOverlay.node();
    }
  }, [chart]);

  if (!overlayRef.current) return null;

  return (
    <PortalByRef container={overlayRef.current}>
      {children}
    </PortalByRef>
  );
}

(ReactD3ChartOverlay as React.FC).displayName = 'D3ChartOverlay';
export default ReactD3ChartOverlay;
