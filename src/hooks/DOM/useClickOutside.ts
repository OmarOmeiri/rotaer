/* eslint-disable require-jsdoc */
import React, {
  useCallback,
  useLayoutEffect,
} from 'react';

export type useClickOutsideProps = {
  ref: React.MutableRefObject<HTMLElement | null> | React.ForwardedRef<any>,
  isOpen: boolean,
  cb: (e: MouseEvent) => void
  exclude?: React.MutableRefObject<HTMLElement | null>
}

/**
 * Runs a callback if user clicked outside an element
 * @param ref the element ref
 * @param isOpen Is the element open
 * @param setShow a function to be ran on outside click
 * @returns
 */
export const useClickOutside = ({
  ref,
  isOpen,
  cb,
  exclude
}: useClickOutsideProps, deps?: any[]): void => {
  const handleClick = useCallback((e: MouseEvent) => {
    if ((ref as React.MutableRefObject<any>)?.current) {
      const withinBoundaries = e.composedPath().includes(
        (ref as React.MutableRefObject<any>)?.current,
      );
      const shouldExclude = !exclude
      ? false
      : exclude.current === e.target
      if (!withinBoundaries && !shouldExclude) {
        cb(e);
      }
    }
  }, [cb, ref, exclude]);

  useLayoutEffect(() => {
    if (isOpen && (ref as React.MutableRefObject<any>)?.current) {
      document.addEventListener('click', handleClick);
    } else {
      document.removeEventListener('click', handleClick);
    }
    return () => {
      document.removeEventListener('click', handleClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, handleClick, ...(deps || [])]);
};
