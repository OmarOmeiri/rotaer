import React, { useCallback, useRef } from 'react';

export const useClickOrDrag = (
  threshold = 10,
) => {
  const x = useRef(0);
  const y = useRef(0);
  const start = useCallback((
    e: MouseEvent
    | TouchEvent
    | React.MouseEvent
    | React.TouchEvent,
  ) => {
    if (window.TouchEvent && e instanceof TouchEvent && !e.touches.length) return;
    const { clientX, clientY } = e instanceof MouseEvent
      ? e
      : (e as TouchEvent).touches[0];
    x.current = clientX;
    y.current = clientY;
  }, []);

  const isDrag = useCallback((
    e: MouseEvent
    | TouchEvent
    | React.MouseEvent
    | React.TouchEvent,
  ): boolean => {
    if (
      window.TouchEvent
      && e instanceof TouchEvent
      && !e.touches.length
      && !e.changedTouches.length
    ) return false;
    const { clientX, clientY } = e instanceof MouseEvent
      ? e
      : (e as TouchEvent).touches[0] || (e as TouchEvent).changedTouches[0];

    const deltaX = Math.abs(clientX - x.current);
    const deltaY = Math.abs(clientY - y.current);
    return !(deltaX < threshold && deltaY < threshold);
  }, [threshold]);

  return {
    start,
    isDrag,
  };
};
