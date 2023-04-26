/* eslint-disable require-jsdoc */
import React, { useCallback, useRef, useState } from 'react';

type returnType<T, U> =
    U extends true ? React.MutableRefObject<T> :
      U extends false ? [React.MutableRefObject<T>, (newState: T) => void] :
        never;

/**
 * Passes an updated State reference
 * @param {*} value
 * @returns
 */

export function useSyncStateRef<T, U extends boolean = false>({
  value,
  isProp = false as U,
  onChange,
}: {
  value: T,
  isProp?: U,
  onChange?: (value: T, oldValue: T) => void,
}): returnType<T, U> {
  const ref = useRef<T>(value);
  const [_, forceRender] = useState<{check: boolean}>({ check: false });

  /**
   * Updates the state
   * @param {*} newState
   */
  const updateState = useCallback((newState: T):void => {
    if (!Object.is(ref.current, newState)) {
      ref.current = newState;
      if (onChange) onChange(newState, ref.current);
      forceRender(({ check }) => ({ check: !check }));
    }
  }, [onChange]);

  if (isProp) {
    ref.current = value;
    return ref as returnType<T, U>;
  }
  return [ref, updateState] as returnType<T, U>;
}
