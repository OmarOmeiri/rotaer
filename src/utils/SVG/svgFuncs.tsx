import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

export const svgToDataURI = <SVG extends React.ReactNode>(svg: SVG) => {
  const markerSvgString = encodeURIComponent(
    //@ts-ignore
    renderToStaticMarkup(svg)
  );
  return `data:image/svg+xml,${markerSvgString}`
}