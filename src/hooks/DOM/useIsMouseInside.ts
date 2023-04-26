import { debounce } from 'lullo-utils/Timer';
import React, {
  useEffect,
  useState,
} from 'react';
import { getElmPosition } from '@/utils/HTML/htmlPosition';

export const useIsMouseInside = (
  ref: React.MutableRefObject<HTMLElement | null>,
  timeout: number,
  enabled?: boolean,
): [isInside: boolean, setIsInside: React.Dispatch<React.SetStateAction<boolean>>] => {
  const [isInside, setIsInside] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const handleWindowMouseMove = debounce((event: MouseEvent) => {
    setCoords({
      x: event.clientX,
      y: event.clientY,
    });
  }, timeout);
  useEffect(() => {
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, []);

  useEffect(() => {
    if (enabled === false) {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    if (ref.current) {
      const pos = getElmPosition(ref.current);
      const xBounds = [pos.x, pos.x + pos.width];
      const yBounds = [pos.y, pos.y + pos.height];
      const isInsideX = coords.x >= xBounds[0] && coords.x <= xBounds[1];
      const isInsideY = coords.y >= yBounds[0] && coords.y <= yBounds[1];
      if (isInsideX && isInsideY) {
        setIsInside(true);
      } else {
        setIsInside(false);
      }
    }
  }, [coords, ref]);
  return [isInside, setIsInside];
};
