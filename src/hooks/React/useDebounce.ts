import { useEffect } from 'react';

export const useDebounce = (
  effect: () => void,
  deps: any[],
  delay: number,
  leading?: boolean,
): void => {
  useEffect(() => {
    if (leading) {
      effect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leading]);

  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);
    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
};
