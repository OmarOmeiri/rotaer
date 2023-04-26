import { ErrorCodes } from 'lullo-common-types';
import { useCallback } from 'react';
import errorHelper from '@/utils/Errors/errorHelper';

/**
 * Runs a callback function whenever the ref changes
 * @returns
 */
export function useSetRefWithCallback<T, A extends Array<any> = Array<any>>(calbackFn: (node: T, ...args: A) => void): (node: T, ...args: A) => void {
  const onRefChange = useCallback((node: T, ...args: A) => {
    if (node) {
      try {
        calbackFn(node, ...args);
      } catch (err) {
        errorHelper({
          message: '',
          code: ErrorCodes.unknownError,
          stack: err.stack,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return onRefChange;
}
