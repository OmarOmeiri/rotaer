import { useEffect } from 'react';

// ## function declaration
export const useScrollDirection = (
  fn: (dir: 'up' | 'down') => void,
  elm: HTMLElement | null,
  deps: Array<any>,
) => {
  useEffect(() => {
    let lastKnownScroll = 0;
    let ticking = false;
    const listener = () => {
      if (elm) {
        const previousKnownScroll = lastKnownScroll;
        lastKnownScroll = elm.scrollTop;
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (previousKnownScroll > lastKnownScroll) {
              fn('up');
            } else {
              fn('down');
            }
            ticking = false;
          });
          ticking = true;
        }
      }
    };
    if (elm) {
      elm.addEventListener('scroll', listener);
    }

    return () => {
      if (elm) elm.removeEventListener('scroll', listener);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elm, fn, ...(deps || [])]);
};
