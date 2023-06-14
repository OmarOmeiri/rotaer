import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export const svgToDataURI = <SVG extends React.ReactNode>(svg: SVG) => {
  const markerSvgString = encodeURIComponent(
    // @ts-ignore
    renderToStaticMarkup(svg),
  );
  return `data:image/svg+xml,${markerSvgString}`;
};

export type SVGElementRescale = {
  bbox: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  width: number;
  height: number;
  wScale: number;
  hScale: number;
  toString(): string;
};

export const scaleSVGElement = (
  elem: SVGGraphicsElement,
  desiredDimensions: { width?: number; height?: number; },
): SVGElementRescale => {
  const { width: dWidth, height: dHeight } = desiredDimensions;
  const bbox = elem.getBBox();
  if ((!dWidth && !dHeight)) {
    return {
      bbox: {
        x: bbox.x,
        y: bbox.y,
        height: bbox.height,
        width: bbox.width,
      },
      width: bbox.width,
      height: bbox.height,
      wScale: 1,
      hScale: 1,
      toString() {
        return `scale(${this.wScale}, ${this.hScale})`;
      },
    };
  }
  let wScale = 1;
  let hScale = 1;
  if (dWidth) wScale = dWidth / bbox.width;
  if (dHeight) hScale = dHeight / bbox.height;

  if (!Number.isFinite(wScale)) { wScale = 0; }
  if (!Number.isFinite(hScale)) { hScale = 0; }

  return {
    bbox: {
      x: bbox.x,
      y: bbox.y,
      height: bbox.height,
      width: bbox.width,
    },
    width: bbox.width * wScale,
    height: bbox.height * hScale,
    wScale,
    hScale,
    toString() {
      return `scale(${this.wScale}, ${this.hScale})`;
    },
  };
};

export const parseViewBox = (element: Element) => {
  const viewBox = element.getAttribute('viewBox');
  if (!viewBox) throw new Error('Element does not have a "viewBox" attribute.');
  const split = viewBox.split(' ').map(Number);
  return {
    x: split[0],
    y: split[1],
    width: split[2],
    height: split[3],
  };
};
