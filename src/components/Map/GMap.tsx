'use client';

import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { debounce } from 'lodash';
import { renderToStaticMarkup } from 'react-dom/server';
import Link from 'next/link';
import { TAerodromPrelimInfo } from '../../types/app/aerodrome';
import { svgToDataURI } from '../../utils/SVG/svgFuncs';
import Config from '../../config';
import { MapMarker } from '../Icons/Map/MapMarker';
import classes from './GMap.module.css';
import { Marker } from './Marker';
import BoundingSuperClusterAlgorithm from '../../utils/Map/SuperClusterAlgorithm';
import { APP_ROUTES } from '../../consts/routes';
import { smoothlyAnimatePanTo } from '../../utils/Map/smoothPan';
import AerodromeInfoWindow from './AerodromeInfoWindow';

const aerodromeColors = Config.get('styles').colors.aerodromes;
const mapMarkers = {
  AD: svgToDataURI(<MapMarker color={aerodromeColors.AD.color}/>),
  HP: svgToDataURI(<MapMarker color={aerodromeColors.HP.color}/>),
  HD: svgToDataURI(<MapMarker color={aerodromeColors.HD.color}/>),
  other: svgToDataURI(<MapMarker color={aerodromeColors.other.color}/>),
};

const mapOptions: google.maps.MapOptions = {
  center: {
    lat: -15.798904316306151,
    lng: -55,
  },
  zoom: 5,
  mapId: process.env.NEXT_PUBLIC_GMAPS_MAP_ID,
};

const getMarkerDataUri = (m: TAerodromPrelimInfo) => {
  const { type } = m;
  if (type in mapMarkers) return mapMarkers[type as keyof typeof mapMarkers];
  return mapMarkers.other;
};

const getMarkerProps = (m: TAerodromPrelimInfo): google.maps.MarkerOptions => ({
  position: { lat: m.coords.decimal.lat, lng: m.coords.decimal.lon },
  icon: getMarkerDataUri(m),
  title: m.icao,
});

const makeMarker = (
  m: TAerodromPrelimInfo,
  map: google.maps.Map,
) => {
  const marker = new google.maps.Marker(getMarkerProps(m));
  const infowindow = new google.maps.InfoWindow({
    content: renderToStaticMarkup(AerodromeInfoWindow(m)),
    ariaLabel: m.icao,
  });
  marker.addListener('click', (e: any) => {
    smoothlyAnimatePanTo(map, e.latLng);

    infowindow.open({
      anchor: marker,
      map,
    });
  });
  return marker;
};

const createMarkers = (
  mkrs: TAerodromPrelimInfo[],
  map: google.maps.Map,
) => {
  const markers = mkrs.map((m) => makeMarker(m, map));

  return new MarkerClusterer({
    markers,
    map,
    algorithm: new BoundingSuperClusterAlgorithm({ radius: 160, minPoints: 4 }),
  });
};

const updateMarkers = (
  mkrs: TAerodromPrelimInfo[],
  clusterer: MarkerClusterer,
  map: google.maps.Map,
) => {
  const markers = mkrs.map((m) => makeMarker(m, map));
  // @ts-ignore
  (clusterer.algorithm as BoundingSuperClusterAlgorithm).calculate({ map, markers });
};

const GMap = ({
  markers = [],
}: {
  markers?: TAerodromPrelimInfo[]
}) => {
  const mapRef = useRef<null | HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMapRefSet, setIsMapRefSet] = useState(false);
  const clusterer = useRef<MarkerClusterer | null>(null);
  const setMapRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      mapRef.current = node;
      setIsMapRefSet(true);
    }
  }, []);

  const debouncer = useRef(debounce((
    markers: TAerodromPrelimInfo[],
    clusterer: MarkerClusterer,
    map: google.maps.Map,
  ) => {
    if (map && clusterer) {
      updateMarkers(markers, clusterer, map);
    }
  }, 300));

  const onBoundsChange = useCallback(() => {
    if (clusterer.current && map) {
      debouncer.current(markers, clusterer.current, map);
    }
  }, [debouncer, map, clusterer, markers]);

  useEffect(() => {
    const ref = mapRef.current;
    if (ref) {
      setMap(new window.google.maps.Map(ref, mapOptions));
    }
  }, [isMapRefSet]);

  useEffect(() => {
    let onBoundChangeListener: google.maps.MapsEventListener | null = null;
    if (map) {
      onBoundChangeListener = google.maps.event.addListener(map, 'bounds_changed', onBoundsChange);
    }
    return () => {
      if (onBoundChangeListener) {
        google.maps.event.removeListener(onBoundChangeListener);
      }
    };
  }, [map, onBoundsChange]);

  useEffect(() => {
    if (map) {
      const cluster = createMarkers(markers, map);
      clusterer.current = cluster;
    }
  }, [map, markers]);

  return (
    <div className={classes.MapContainer} ref={setMapRef}/>
  );
};

export default GMap;

