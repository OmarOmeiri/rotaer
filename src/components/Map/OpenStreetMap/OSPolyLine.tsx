import { useEffect, useMemo, useRef } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import type { PathOptions } from 'leaflet';
import { RouteWaypoint } from '../../../utils/Route/Route';

const pathOptions: PathOptions = {
  color: '#f11485',
};

const pathAltOptions: PathOptions = {
  color: '#f11485',
  dashArray: '8 8',
};

const OSPolyLine = ({ waypoints }: {waypoints: RouteWaypoint[]}) => {
  const polyRef = useRef<any>(null);
  const map = useMap();
  const positions = useMemo(() => (
    waypoints
      .filter((w) => !w.alternate)
      .map((w) => [w.coord?.decimal.lat, w.coord?.decimal.lon])
      .filter(([lat, lon]) => typeof lat === 'number' && typeof lon === 'number') as [number, number][]
  ), [waypoints]);

  const positionsAlt = useMemo(() => {
    const altWpts = waypoints
      .filter((w) => w.alternate)
      .map((w) => [w.coord?.decimal.lat, w.coord?.decimal.lon])
      .filter(([lat, lon]) => typeof lat === 'number' && typeof lon === 'number') as [number, number][];
    return [positions[positions.length - 1], ...altWpts];
  }, [waypoints, positions]);

  useEffect(() => {
    if (polyRef.current) {
      map.fitBounds(polyRef.current.getBounds());
    }
  }, [positions, positionsAlt, map]);

  return (
    <>
      <Polyline ref={polyRef} positions={positions} pathOptions={pathOptions}/>
      <Polyline positions={positionsAlt} pathOptions={pathAltOptions}/>
    </>
  );
};

export default OSPolyLine;
