/* eslint-disable require-jsdoc */
import React, { useCallback } from 'react';

export type useHoverInsideProps = {
  ref: React.MutableRefObject<HTMLElement | null>
  | React.ForwardedRef<any | null>,
  delay?: number,
}

/**
 * Returns if mouse is inside an element
 * @param ref the element ref
 * @returns
 */
export const useHoverInside = ({
  ref,
  delay,
}: useHoverInsideProps): () => Promise<boolean> => {
  const get = useCallback(async (): Promise<boolean> => {
    const promise = new Promise((resolve: (value: boolean) => void) => {
      setTimeout(() => {
        const r = ref as React.MutableRefObject<HTMLElement | null>;
        if (r.current) resolve(r.current.matches(':hover'));
        else resolve(false);
      }, delay);
    });
    return promise;
  }, [delay, ref]);

  return get;
};
