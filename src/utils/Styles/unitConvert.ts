import { parseStrToNumber } from 'lullo-utils/Number';
import { getViewport } from '../HTML/htmlPosition';

const RE_REM = /(^\d+|^\d+\.\d+)rem/;
const RE_EM = /(^\d+|^\d+\.\d+)em/;

const isRem = (value: string | number) => {
  if (typeof value === 'number') return true;
  if (RE_REM.test(value)) return true;
  return false;
};

const isEm = (value: string | number) => {
  if (typeof value === 'number') return true;
  if (RE_EM.test(value)) return true;
  return false;
};

export const emToPx = (elem: HTMLElement, em: string | number, strict = true): number => {
  if (strict && !isEm(em)) {
    throw new Error(`em value: ${em} is unknown`);
  }
  const emNum = typeof em === 'number'
    ? em
    : Number(em.replace(/[^\d.]/g, ''));

  return emNum * parseFloat(getComputedStyle(elem.parentElement || document.body).fontSize);
};

export const remToPx = (rem: string | number, strict = true): number => {
  if (strict && !isRem(rem)) {
    throw new Error(`rem value: ${rem} is unknown`);
  }
  const remNum = typeof rem === 'number'
    ? rem
    : Number(rem.replace(/[^\d.]/g, ''));
  return remNum * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

/**
 * Converts pixels to rem .
 *
 * returns a number
 * @param px
 * @returns
 */
export function convertPxToRem(px: string): number {
  return parseStrToNumber(px) / remToPx(1);
}

/**
 * Converts pixels to em .
 *
 * returns a number
 * @param px
 * @returns
 */
export function convertPxToEem(px: string, elem: HTMLElement): number {
  return parseStrToNumber(px) / emToPx(elem, 1);
}

/**
 * Converts a css dimension string ('10px' | '10vh' | '10vw') to pixels
 * @param dim
 * @returns
 */

export const getPxFromCssDimensionString = (dim: string, element?: HTMLElement) => {
  const val = dim.trim();

  if (isEm(val)) {
    if (element) return emToPx(element, val);
    return remToPx(val, false);
  }
  if (isRem(val)) {
    return remToPx(val);
  }

  const isOnlyNum = val.replace(/[0-9.]/g, '').length === 0;
  if (isOnlyNum) return Number(val);
  const numVal = Number(val.replace(/[^\d.]/g, ''));
  const isPx = /px$/i.test(val);
  if (isPx) { return numVal; }

  const isVH = /vh$$/i.test(val);
  if (isVH) {
    const h = getViewport('height');
    return h * (numVal / 100);
  }

  const isVW = /vw$$/i.test(val);
  if (isVW) {
    const w = getViewport('width');
    return w * (numVal / 100);
  }

  throw new Error(`Unknown css dimension string: ${val}`);
};
