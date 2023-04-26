'use client';

import { usePathname } from 'next/navigation';
import {
  useEffect,
  useRef,
} from 'react';

export const useRouteChange = (cb: () => void) => {
  const pathname = usePathname();
  const savedPathNameRef = useRef(pathname);

  useEffect(() => {
    if (savedPathNameRef.current !== pathname) {
      cb();
      savedPathNameRef.current = pathname;
    }
  }, [pathname, cb]);
};

