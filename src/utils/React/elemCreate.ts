/* eslint-disable require-jsdoc */
import React, { useEffect } from 'react';

interface IElemCreateProps<T extends HTMLElement>{
  element: string,
  elemProps?: {
    [key: string]: any,
  },
  elemRef?: React.MutableRefObject<T | null>
  cb?: () => void,
  runCb?: boolean,
  appendTo?: HTMLElement,
}

function ElemCreate<T extends HTMLElement>({
  element,
  elemProps,
  cb,
  runCb,
  elemRef,
}: IElemCreateProps<T>, ref: React.ForwardedRef<T>): JSX.Element | null {
  useEffect(() => {
    if (runCb && cb) {
      cb();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runCb]);

  const elem = React.createElement(element, { ...elemProps, ref: elemRef });
  // ReactDOM.render(
  //   // @ts-ignore
  //   elem,
  //   appendTo,
  // );
  return elem;
}

export default ElemCreate;
