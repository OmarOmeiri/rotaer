import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import _useResizeObserver from '@react-hook/resize-observer';
import { useDebouncedState } from '../React/useDebouncedState';

interface Props {
  callback?: (size: ResizeObserverEntry) => void;
  element: React.RefObject<HTMLElement>;
  delay?: number
}

export const useResizeObserver = ({ callback, element, delay = 0 }: Props) => {
  const [entry, setEntry] = useState<ResizeObserverEntry | null>(null);
  const debouncedSize = useDebouncedState(entry, delay);

  _useResizeObserver(element, (entry) => setEntry(entry));

  useEffect(() => {
    if (debouncedSize && callback) {
      callback(debouncedSize);
    }
  }, [debouncedSize, callback]);

  const getEntry = useCallback(() => (entry), [entry]);
  return getEntry;
};

