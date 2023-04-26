import {
  useCallback, useEffect, useRef, useState,
} from 'react';

export const useMouseDistance = () => {
  const [distance, setDistance] = useState({
    y: 0,
    x: 0,
    total: 0,
  });
  const lastSeen = useRef({
    lastX: -1,
    lastY: -1,
    startX: -1,
    startY: -1,
  });

  const mouseMove = useCallback((event: MouseEvent) => {
    if (lastSeen.current.startX === -1) {
      return;
    }
    if (lastSeen.current.startY === -1) {
      return;
    }
    const y = event.clientY - lastSeen.current.lastY;
    const x = event.clientX - lastSeen.current.lastX;
    lastSeen.current.lastX = event.clientX;
    lastSeen.current.lastY = event.clientY;
    setDistance((d) => ({
      x: d.x + x,
      y: d.y + y,
      total: d.total + Math.sqrt((y) ** 2 + (x) ** 2),
    }));
  }, []);

  const mouseDown = useCallback((event: MouseEvent) => {
    lastSeen.current.startX = event.clientX;
    lastSeen.current.startY = event.clientY;
    lastSeen.current.lastX = event.clientX;
    lastSeen.current.lastY = event.clientY;
  }, []);

  const mouseUp = useCallback(() => {
    lastSeen.current.startX = -1;
    lastSeen.current.startY = -1;
    lastSeen.current.lastX = 0;
    lastSeen.current.lastY = 0;
    setDistance({
      x: 0,
      y: 0,
      total: 0,
    });
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);

    return () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mouseup', mouseUp);
    };
  }, [
    mouseMove,
    mouseDown,
    mouseUp,
  ]);

  return distance;
};
