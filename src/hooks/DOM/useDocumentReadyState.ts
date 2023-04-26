import { useEffect, useState } from 'react';

export const useDocumentReadyState = (
  state: DocumentReadyState = 'complete',
) => {
  const [isReady, setIsReady] = useState(false);

  const readyState = typeof document === 'undefined'
    ? ''
    : document.readyState;

  useEffect(() => {
    if (document.readyState === state) {
      setIsReady(true);
    }
  }, [readyState, state]);

  return isReady;
};
