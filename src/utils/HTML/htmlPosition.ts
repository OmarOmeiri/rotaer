/**
 * Returns the elements full height
 * with margin and padding
 * @param el htmlElement
 * @returns
 */
export function getElmFullHeight(el: HTMLElement): number {
  const styles = window.getComputedStyle(el);
  const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  return Math.ceil(el.offsetHeight + margin);
}
/**
 * Returns the elements full width
 * with margin and padding
 * @param el htmlElement
 * @returns
 */
export function getElmFullWidth(el: HTMLElement): number {
  const styles = window.getComputedStyle(el);
  const margin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  return Math.ceil(el.offsetHeight + margin);
}
/**
 * Returns the elements dimensions
 * with margin and padding
 * @param el htmlElement
 * @returns
 */
export function getElmComputedDimension(el: HTMLElement) {
  const styles = window.getComputedStyle(el);
  return {
    width: styles.width,
    height: styles.height,
  };
}
/**
 * Returns the elements dimensions
 * with margin and padding
 * @param el htmlElement
 * @returns
 */
export function getElmDimension(el: HTMLElement) {
  return {
    width: el.offsetWidth,
    height: el.offsetWidth,
  };
}
/**
 * Returns the elements dimensions relative to the viewport
 * with margin and padding
 * @param el htmlElement
 * @returns
 */
export function getElmPosition(el: HTMLElement) {
  return el.getBoundingClientRect();
}
/**
 * Get the elements position relative to the document
 * @param element
 * @returns
 */
export function getElmDocPosition(element: HTMLElement | SVGSVGElement) {
  const clientRect = element.getBoundingClientRect();
  return {
    top: clientRect.top + document.documentElement.scrollTop,
    left: clientRect.left + document.documentElement.scrollLeft,
  };
}
/**
 * Returns an element position relative to the window
 * @param el
 * @returns
 */
export function getElmOffset(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const { scrollX, scrollY } = window;

  return {
    height: rect.height,
    width: rect.width,
    top: rect.top + scrollY,
    bottom: rect.top + scrollY + rect.height,
    left: rect.left + scrollX,
    right: rect.right + scrollX,
  };
}

export function getViewport(type?: undefined): { width: number; height: number; };
export function getViewport(type: 'height' | 'width'): number;
export function getViewport(type?: 'height' | 'width'): { width: number; height: number; } | number;
/**
 *
 * @param type
 * @returns
 */
export function getViewport(type?: 'height' | 'width') {
  if (type === 'height') {
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0,
    );
  }
  if (type === 'width') {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0,
    );
  }

  return {
    height: Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0,
    ),
    width: Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0,
    ),
  };
}
/**
 * Returns the css vh value for a give amount of pixels
 * @param v the percentage. Eg: 20vh
 * @returns
 */
export function vh(v: number): number {
  const h = getViewport('height');
  return (v * h) / 100;
}
/**
 * Returns the css vh value for a given amount of pixels
 * @param v the percentage. Eg: 20vh
 * @returns
 */
export function vw(v: number): number {
  const w = getViewport('width');
  return (v * w) / 100;
}
/**
 * Returns the document dimensions (limited by window) without scrollbars.
 */
export function clientDimensions() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}
/**
 * Returns window dimensions including scrollbars.
 */
export function windowDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
/**
 * Returns the total width of a list of HTML Elements
 * @param els
 * @returns
 */
export function getNodeListTotalWidth(els: HTMLElement[]): number {
  return Array.from(els).map((el) => el.offsetWidth).reduce((val, acc) => val + acc, 0);
}
