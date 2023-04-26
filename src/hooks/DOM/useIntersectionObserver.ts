/* eslint-disable require-jsdoc */
import React, { useEffect } from 'react';
import { observe, ObserverInstanceCallback } from 'react-intersection-observer';

export function useIntersectionObserver(
  ref: React.MutableRefObject<HTMLElement | null>,
  cb: ObserverInstanceCallback,
  options?: IntersectionObserverInit,
  deps?: undefined,
): void
export function useIntersectionObserver(
  ref: React.MutableRefObject<HTMLElement | null>,
  cb: ObserverInstanceCallback,
  options: IntersectionObserverInit,
  deps: Array<any>,
): void
export function useIntersectionObserver(
  ref: React.MutableRefObject<HTMLElement | null>,
  cb: ObserverInstanceCallback,
  options?: IntersectionObserverInit,
  deps?: Array<any>,
): void
export function useIntersectionObserver(
  ref: React.MutableRefObject<HTMLElement | null>,
  cb: ObserverInstanceCallback,
  options?: IntersectionObserverInit,
  deps?: Array<any>,
) {
  useEffect(() => {
    let destroy: (() => void) | undefined;
    if (ref.current) {
      destroy = observe(ref.current, cb, options);
    }
    return () => {
      if (destroy) {
        destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || [])]);
}
