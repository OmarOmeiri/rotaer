import React from 'react';
import { convertCamelCase } from 'lullo-utils/String';

/**
 * Converts the camelCase styles of react to normal CSS styles
 * @param styles
 */
export function convertReactStylesToCssStyles(styles: React.CSSProperties): {[key: string]: any} {
  const cssStyles: {[key: string]: any} = {};
  Object.keys(styles).forEach((k) => {
    cssStyles[convertCamelCase({ str: k, insert: '-' })] = styles[k as keyof typeof styles];
  });
  return cssStyles;
}

/**
 * Converts an object to a css string
 * @returns
 */
export const ObjToCss = ({ obj, fallBack }:{obj: React.CSSProperties, fallBack?: React.CSSProperties}): string => {
  if (fallBack) {
    const fallBackKeys = Object.keys(fallBack);
    const objKeys = Object.keys(obj);
    fallBackKeys.forEach((k) => {
      // @ts-ignore
      if (!objKeys.includes(k)) obj[k] = fallBack[k];
    });
  }
  return (
    `${Object.entries(convertReactStylesToCssStyles(obj)).map(([k, v]) => `${k}:${v}`).join(';\n')};`
  );
};

/**
 * Returns the value of a css variable
 */
export const getCssVariable = (varName: string): string => getComputedStyle(document.documentElement)
  .getPropertyValue(varName).trim();
