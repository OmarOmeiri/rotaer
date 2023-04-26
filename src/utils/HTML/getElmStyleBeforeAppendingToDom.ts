import React from 'react';

/**
 * returns an object containing all properties for a given class, or returns a single
 * property value if "name" is provided
 * @param elm html element
 * @param [name] (optional) The property name to be returned. If not provided returns the complete style.
 * @param the element tag name. Defaults as 'div'
 */

export function getElmStyleBeforeAppendingToDom<T extends undefined>({
  className, name, elmTag,
}: {
  className: string;
  name?: T;
  elmTag?: string;
}): React.CSSProperties;
export function getElmStyleBeforeAppendingToDom<T extends keyof React.CSSProperties>({
  className, name, elmTag,
}: {
  className: string;
  name: T;
  elmTag?: string;
}): React.CSSProperties[T];
// eslint-disable-next-line require-jsdoc
export function getElmStyleBeforeAppendingToDom<T extends keyof React.CSSProperties>({
  className, name, elmTag = 'div',
}: {
  className: string;
  name?: T;
  elmTag?: string;
}): React.CSSProperties[T] | React.CSSProperties {
  const element = document.createElement(elmTag);
  const { body } = document;
  element.className = className;
  element.style.display = 'none';
  element.id = 'dummy-styled-elm';
  body.insertBefore(element, body.firstChild);
  const style = JSON.stringify(getComputedStyle(element));
  body.removeChild(element);

  const test = JSON.parse(style) as React.CSSProperties;

  if (name) return test[name];
  return test;
}
