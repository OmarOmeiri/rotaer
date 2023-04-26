import {
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * Hook to call a webWorker
 * @param url
 * @param postMessage
 * @returns
 */
export function useWebWorker<R>(
  url: string,
  postMessage: any,
) {
  const workerRef = useRef<null | Worker>(null);
  const [workerResponse, setWorkerResponse] = useState<null | R>(null);
  useEffect(() => {
    workerRef.current = new Worker(new URL(url, import.meta.url));
    workerRef.current.onmessage = (evt) => {
      setWorkerResponse(evt.data);
    };
    workerRef.current.postMessage(postMessage);
    return () => {
      workerRef?.current?.terminate();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return workerResponse;
}
