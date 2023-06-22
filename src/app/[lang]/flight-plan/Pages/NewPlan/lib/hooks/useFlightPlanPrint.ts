import { useCallback, useRef } from 'react';

const useFlightPlanPrint = () => {
  const printerRef = useRef<HTMLAnchorElement | null>(null);

  const print = useCallback(() => {
    if (printerRef.current) {
      printerRef.current.click();
    }
  }, []);

  return {
    printerRef,
    print,
  };
};

export default useFlightPlanPrint;

