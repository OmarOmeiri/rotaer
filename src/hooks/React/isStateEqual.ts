import compare from 'lodash/isEqual';
import { useEffect, useRef, useState } from 'react';

export const useIsStateEqual = <T>(state: T): boolean => {
  const [isEqual, setIsEqual] = useState(true);
  const prevState = useRef(state);

  useEffect(() => {
    const isequal = compare(prevState.current, state);
    if (!isequal) setIsEqual((state) => !state);
  }, [state]);
  return isEqual;
};
