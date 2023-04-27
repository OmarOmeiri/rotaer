import { objHasProp } from 'lullo-utils/Objects';
import React from 'react';
import type csstype from 'csstype';
import { getCssVariable } from '../Styles/styleFuncs';

// eslint-disable-next-line import/no-unresolved
/**
 * Creates a hidden element in the dom and returns it
 * @param param0
 * @returns
 */
export function getElementBeforeAppendingToDom<E extends HTMLElement>(
  elm: HTMLElement,
  cb: (e: E) => void,
): void {
  const wrapper = document.createElement('div');
  wrapper.style.width = '0';
  wrapper.style.height = '0';
  const { body } = document;
  body.insertBefore(wrapper, body.firstChild);
  wrapper.appendChild(elm);
  cb(elm as E);
  // body.removeChild(elm);
}

export function isHtmlNode<K extends keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap>(
  elm: unknown,
  name: K
): elm is (HTMLElementTagNameMap & SVGElementTagNameMap)[K]
export function isHtmlNode(
  elm: unknown,
  name?: undefined
): elm is Node
/**
 * Return true if elm is an HTMLNode
 * @param elm
 * @returns
 */
export function isHtmlNode<K extends keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap>(
  elm: unknown,
  name?: undefined | K,
): elm is Node | (HTMLElementTagNameMap & SVGElementTagNameMap)[K] {
  if (
    elm
    && typeof elm === 'object'
    && objHasProp(elm, ['nodeType', 'nodeName'])
    && typeof elm.nodeType === 'number'
    && typeof elm.nodeName === 'string'
  ) {
    if (name && elm.nodeName === name) return true;
    if (name && elm.nodeName !== name) return false;
    return true;
  }
  return false;
}

export function isHtmlElement<K extends keyof HTMLElementTagNameMap>(
  elm: unknown,
  name: K
): elm is HTMLElementTagNameMap[K]
export function isHtmlElement(
  elm: unknown,
  name?: undefined
): elm is HTMLElement
/**
 * Return true if elm is an HTMLElement
 * @param elm
 * @returns
 */
export function isHtmlElement<K extends keyof HTMLElementTagNameMap>(
  elm: unknown,
  name?: K,
): elm is HTMLElement | HTMLElementTagNameMap[K] {
  if (typeof HTMLElement === 'object') {
    return elm instanceof HTMLElement;
  }
  if (
    elm
    && typeof elm === 'object'
    && objHasProp(elm, ['nodeType', 'nodeName'])
    && elm.nodeType === 1
    && typeof elm.nodeName === 'string'
  ) {
    if (name && elm.nodeName === name) return true;
    if (name && elm.nodeName !== name) return false;
    return true;
  }

  return false;
}

/**
 * Returns a parent element by a className.
 *
 * maxIter defaults fo 5
 * @param elm
 * @param className
 * @param maxIter
 */
export function getParentElementByClassName(elm: HTMLElement, className: string, maxIter = 5): HTMLElement | null {
  let currElm: HTMLElement | null = elm;
  let count = 0;
  while (count < maxIter && currElm && !currElm.classList.contains(className)) {
    currElm = currElm?.parentElement ?? null;
    count += 1;
  }
  return currElm;
}

/**
 * Gets the computed style for a given element.
 * @param element
 * @param property
 * @returns
 */
export function getElmComputedStyle(element: HTMLElement, property: csstype.StandardLonghandPropertiesHyphen): string {
  const val = window.getComputedStyle(element, null).getPropertyValue(property as string).trim();
  if (/^var\(--.*/.test(val)) return getCssVariable(val);
  return val;
}

/**
 * Checks if an element is a child of another element
 * @param childObject
 * @param containerObject
 * @returns
 */
export function isChildOf({
  elm,
  parentClassname,
  parentId,
}: {
  elm: HTMLElement,
  parentClassname?: string,
  parentId?: string
}): [boolean, Element | null] {
  let parentElm: Element | null = null;
  if (parentId) parentElm = document.getElementById(parentId);
  if (parentClassname) [parentElm] = Array.from(document.getElementsByClassName(parentClassname));
  if (parentElm) return [parentElm.contains(elm), parentElm];
  return [false, null];
}

/**
 * Checks if an element is a child of another element
 * @param parent
 * @param child
 * @returns
 */
export const isChildOfElem = ({
  parent,
  child,
}: {
  parent: Element,
  child: Element,
}): boolean => parent.contains(child);

/**
 * Checks if an element is overflowing another parent element
 */
export function isElmOverFlowing(
  child: Element,
  parent: Element,
  type: 'x' | 'y' | 'xy',
): boolean {
  const childRect = child.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  if (type === 'x') return childRect.left < parentRect.left || childRect.right > parentRect.right;
  if (type === 'y') return childRect.top < parentRect.top || childRect.bottom > parentRect.bottom;
  return childRect.top < parentRect.top || childRect.bottom > parentRect.bottom || childRect.left < parentRect.left || childRect.right > parentRect.right;
}

export const getTextWidth = (text: string, font: string, offset = 0) => {
  // re-use canvas object for better performance
  const canvas: HTMLCanvasElement = (getTextWidth as any).canvas
  || ((getTextWidth as any).canvas = document.createElement('canvas'));

  const context = canvas.getContext('2d');
  if (!context) return;
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width + offset;
};

export const getCssStyle = (element: Element, prop: string) => (
  window.getComputedStyle(element, null).getPropertyValue(prop)
);

export const getCanvasFont = (el = document.body) => {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
  const fontSize = getCssStyle(el, 'font-size') || '16px';
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

  return `${fontWeight} ${fontSize} ${fontFamily}`;
};

export const copyAttributes = (
  source: Element,
  target: Element,
  mutate?: (name: string, value: string) => string | undefined,
) => {
  for (const attr of Array.from(source.attributes)) {
    const { nodeValue, nodeName } = attr;
    if (nodeValue) {
      target.setAttribute(
        nodeName === 'id' ? 'data-id' : nodeName,
        mutate ? (mutate(nodeName, nodeValue) || nodeValue) : nodeValue,
      );
    }
  }
};

export const appendElement = <K extends keyof HTMLElementTagNameMap>(
  parent: Element,
  e: K,
  props?: {
    [P in keyof React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLElementTagNameMap[K]>, HTMLElementTagNameMap[K]>]: string
  },
) => {
  const elem = document.createElement(e);
  Object.entries(props || {})
    .forEach(([p, v]) => {
      elem.setAttribute(p, v);
    });
  parent.insertAdjacentElement('afterbegin', elem);
  return elem;
};

// eslint-disable-next-line require-jsdoc
export function* iterChildren(elm: Element): Generator<Element, void, unknown> {
  for (const child of elm.children) {
    yield child;
    if (child.children.length) {
      for (const innerChild of child.children) {
        yield* iterChildren(innerChild);
      }
    }
  }
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
export function stringToHtmlElement(htmlString: string) {
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild as HTMLElement;
}
