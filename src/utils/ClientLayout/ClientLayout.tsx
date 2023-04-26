'use client'
import React, {
  useCallback,
  useLayoutEffect,
} from 'react';

function ClientLayout() {
  const setPageDims = useCallback(() => {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    document.documentElement.style.setProperty('--vh', `${vh - 2}px`);
  }, []);

  if (typeof document === 'undefined') {
    React.useLayoutEffect = React.useEffect;
  }

  if (typeof window !== 'undefined') {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
  }

  useLayoutEffect(() => {
    setPageDims();
    window.addEventListener('resize', setPageDims);
    return () => {
      window.removeEventListener('resize', setPageDims)
    }
  }, [setPageDims]);

  return null;
}

export default ClientLayout;
