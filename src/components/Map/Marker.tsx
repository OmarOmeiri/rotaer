import React, { MouseEventHandler, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

interface IMarkerProps {
  map: google.maps.Map,
  position: {lat: number, lng: number},
  children: React.ReactNode,
  onClick?: MouseEventHandler
}

export const Marker = ({
  map,
  children,
  position,
  onClick,
}: IMarkerProps) => {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerView | null>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (!rootRef.current) {
      const container = document.createElement('div');
      rootRef.current = createRoot(container);
      markerRef.current = new google.maps.marker.AdvancedMarkerView({
        position,
        content: container,
      });
    }
  }, [position]);

  useEffect(() => {
    let listener: google.maps.MapsEventListener | null = null;
    if (rootRef.current) rootRef.current.render(children);
    if (markerRef.current) {
      markerRef.current.position = position;
      markerRef.current.map = map;
      if (onClick) {
        listener = markerRef.current.addListener('click', onClick);
      }
    }
    return () => {
      if (listener) listener.remove();
    };
  }, [
    map,
    position,
    children,
    onClick,
  ]);

  return null;
};
