import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const ScrollToTop = () => {
  const { pathname, isReady } = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname, isReady]);

  return null;
};
