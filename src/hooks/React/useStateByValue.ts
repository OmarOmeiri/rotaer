import { isEqual } from 'lodash';
import { useCallback, useState } from 'react';

export const useStateByValue = <T>(initialState: T): [
  T,
  SetState<T>
] => {
  const [state, setStateByValue] = useState(initialState);

  const setState = useCallback((newState: T | ((st: T) => T)) => {
    if (typeof newState === 'function') {
      const newSt = (newState as ((st: T) => T))(state);
      if (isEqual(state, newSt)) return;
      setStateByValue(newSt);
      return;
    }

    if (isEqual(newState, state)) return;
    setStateByValue(newState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [state, setState];
};
