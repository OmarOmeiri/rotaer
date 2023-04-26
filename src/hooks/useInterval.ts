import {
  useEffect, useState, useRef, useCallback,
} from 'react';

export const useInterval = ({
  effect,
  delay,
  nRuns,
}:{
  effect: () => void,
  delay: number,
  nRuns?: number
}, deps: any[]): {fire: () => void, destroy: () => void} => {
  const [start, setStart] = useState(false);
  const [stop, setStop] = useState(true);
  const intervalId = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (!stop) {
      let counter = 0;
      const id = setInterval(() => {
        if (nRuns && counter === nRuns) {
          clearInterval(intervalId.current as unknown as number);
        } else {
          effect();
          counter += 1;
        }
      }, delay);
      intervalId.current = id;
    } else {
      clearInterval(intervalId.current as unknown as number);
    }
    return () => clearInterval(intervalId.current as unknown as number);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay, nRuns, start, stop]);

  const fire = useCallback(() => {
    setStart((val) => val !== true);
    setStop(false);
  }, []);
  const destroy = useCallback(() => setStop(true), []);

  return { fire, destroy };
};
