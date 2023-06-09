import {
  Fragment, useEffect, useMemo, useRef,
} from 'react';
import {
  Marker, Polyline, Tooltip, useMap,
} from 'react-leaflet';
import type { PathOptions } from 'leaflet';
import { Icon } from 'leaflet';
import AerodromeIcon from '@icons/aerodrome-pin.svg?url';
import CircleIcon from '@icons/circle-solid.svg';
import classes from './OS.module.css';
import { RouteWaypoint } from '../../../utils/Route/Route';
import { svgToDataURI } from '../../../utils/SVG/svgFuncs';

const pathOptions: PathOptions = {
  color: '#f11485',
};

const pathAltOptions: PathOptions = {
  color: '#f11485',
  dashArray: '8 8',
};

const routePointIcon = new Icon({
  iconUrl: svgToDataURI(<CircleIcon fill="#FF4AFC"/>),
  iconSize: [12, 12],
});

const aerodromeMarker = new Icon({
  iconUrl: AerodromeIcon,
  iconSize: [15, 15],
});

const OSPolyLine = ({
  waypoints,
}: {
  waypoints: RouteWaypoint[]
}) => {
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

  const positionMarkers = useMemo(() => {
    const adCoords = (
      waypoints
        .map((w) => ({ name: w.name, coords: [w.coord?.decimal.lat, w.coord?.decimal.lon], type: w.type }))
        .filter(({ coords: [lat, lon] }) => typeof lat === 'number' && typeof lon === 'number')
      ) as {name: string, type: string, coords: [number, number]}[];
    return adCoords;
  }, [waypoints]);

  useEffect(() => {
    if (polyRef.current) {
      map.fitBounds(polyRef.current.getBounds());
    }
  }, [positions, positionsAlt, map]);

  return (
    <>
      <Polyline ref={polyRef} positions={positions} pathOptions={pathOptions}/>
      <Polyline positions={positionsAlt} pathOptions={pathAltOptions}/>
      {
        positionMarkers.map((p) => (
          <Fragment key={p.name}>
            <Marker
              position={p.coords}
              icon={p.type === 'ad' ? aerodromeMarker : routePointIcon}
            >
              <Tooltip direction="right">
                <div className={classes.RoutePointTooltip}>
                  {p.name}
                </div>
              </Tooltip>
            </Marker>
          </Fragment>
        ))
      }
    </>
  );
};

export default OSPolyLine;
