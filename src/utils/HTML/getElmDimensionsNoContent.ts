import { getPxFromCssDimensionString } from '../Styles/unitConvert';

export const getElmDimensionsNoContent = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);

  const width = getPxFromCssDimensionString(style.marginLeft, element)
    + getPxFromCssDimensionString(style.marginRight, element)
    + getPxFromCssDimensionString(style.paddingLeft, element)
    + getPxFromCssDimensionString(style.paddingRight, element)
    + getPxFromCssDimensionString(style.borderLeftWidth, element)
    + getPxFromCssDimensionString(style.borderRightWidth, element);

  const height = getPxFromCssDimensionString(style.marginTop, element)
    + getPxFromCssDimensionString(style.marginBottom, element)
    + getPxFromCssDimensionString(style.paddingTop, element)
    + getPxFromCssDimensionString(style.paddingBottom, element)
    + getPxFromCssDimensionString(style.borderTopWidth, element)
    + getPxFromCssDimensionString(style.borderBottomWidth, element);

  return {
    width,
    height,
  };
};
