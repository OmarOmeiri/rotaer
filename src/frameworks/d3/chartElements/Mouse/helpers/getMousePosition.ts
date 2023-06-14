import { pointer } from 'd3';
import { getElmDocPosition } from '../../../../../utils/HTML/htmlPosition';

import type D3Chart from '../../../Chart';

export const D3GetMousePosition = (e: any, chart: D3Chart): [number, number] => {
  const [x, y] = pointer(e);
  return [
    x - chart.dims.margin.left,
    y - chart.dims.margin.top,
  ];
};

export const D3GetMousePositionToViewPort = (e: any, chart: D3Chart): [number, number] => {
  const [x, y] = pointer(e);
  const node = chart.svg.node();
  if (!node) return [0, 0];
  const svgPosition = getElmDocPosition(node);

  return [
    x + svgPosition.left,
    y + svgPosition.top,
  ];
};
