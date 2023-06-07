import React, { useMemo } from 'react';
import {
  MapContainer,
  MapContainerProps,
  TileLayer,
} from 'react-leaflet';

type Props = {
  children?: React.ReactNode;
  mapProps?: MapContainerProps
}

const DEFAULT_MAP_OPTIONS: MapContainerProps = {
  center: {
    lat: -15.798904316306151,
    lng: -55,
  },
  zoom: 5,
  scrollWheelZoom: true,
};

const OSMap = ({
  children,
  mapProps,
}: Props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const props = useMemo(() => ({ ...DEFAULT_MAP_OPTIONS, ...mapProps }), []);
  return (
    <MapContainer
      {...props}
    >
      <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    />
      {children || null}
    </MapContainer>
  );
};

export default OSMap;
