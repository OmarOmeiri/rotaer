import { ErrorCodes } from 'lullo-common-types';
import React, {
  useCallback,
  useRef,
  useState,
} from 'react';
import errorHelper from '@/utils/Errors/errorHelper';

/**
 * Runs a callback function whenever the ref changes
 * and returns the ref of the current node
 * @returns
 */
export function useRefWithCallback<T>(calbackFn: (node: T) => void, deps: any[] = []): [React.MutableRefObject<T | null>, (node: T) => void] { // [(node: T) => void, React.MutableRefObject<T | null>]
  const [, setRef] = useState(false);
  const rf = useRef<null | T>(null);

  const onRefChange = useCallback((node: T) => {
    setRef((ref) => ref !== true);
    if (node) {
      try {
        rf.current = node;
        calbackFn(node);
      } catch (err) {
        errorHelper({
          message: '',
          code: ErrorCodes.unknownError,
          stack: err.stack,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, calbackFn]);

  return [rf, onRefChange];
}
