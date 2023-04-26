/* eslint-disable arrow-body-style */
import { useEffect, useRef } from 'react';

export const useOnUnmount = (callback: () => void) => {
  const onUnmount = useRef<(() => void) | null>(null);
  onUnmount.current = callback;

  useEffect(() => {
    return () => onUnmount.current?.();
  }, []);
};
