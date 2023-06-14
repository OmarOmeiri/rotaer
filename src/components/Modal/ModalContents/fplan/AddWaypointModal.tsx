import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import z from 'zod';
import GlobeIcon from '@icons/earth-americas-solid.svg';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import {
  useMap,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import LatLonIcon from '@icons/lat-lon.svg';
import LocationPin from '@icons/location-pin-green.svg?url';
import styled from 'styled-components';
import { Icon } from 'leaflet';
import Translator from '../../../../utils/Translate/Translator';
import GenericModal from '../GenericModal/GenericModal';
import classes from './AddWaypointModal.module.css';
import modalStore from '../../../../store/modal/modalStore';
import { IInput, inputTypes } from '../../../Forms/typings';
import Input from '../../../Forms/Input';
import Config from '../../../../config';
import { useForms } from '../../../../hooks/Forms/useForm';
import ModalEnterBtn from '../ModalEnterBtn';
import { zodCoordinateValidator } from '../../../../frameworks/zod/zodCoordinates';
import { zodAltitudeValidator } from '../../../../frameworks/zod/zodRoute';
import { UserWaypointAdded } from '../../../../app/[lang]/flight-plan/types';
import OSMap from '../../../Map/OpenStreetMap/OSMap';
import { decimalCoordinatesToDegMinSec } from '../../../../utils/converters/coordinates';
import ButtonClient from '../../../Buttons/ButtonClient';
import 'leaflet-geosearch/dist/geosearch.css';

type OnCoordHandler = (coords: {decimal: {lat: number, lon: number}, degMinSec: string}) => void

const styles = Config.get('styles');

const translator = new Translator({
  title: { 'en-US': 'Add waypoint', 'pt-BR': 'Adicionar waypoint' },
  btn: { 'en-US': 'OK', 'pt-BR': 'Ok' },
  invalidName: { 'en-US': 'Invalid name', 'pt-BR': 'Nome inválido' },
  invalidCoord: { 'en-US': 'Invalid coordinates', 'pt-BR': 'Coordenadas inválidas' },
  name: { 'en-US': 'Name', 'pt-BR': 'Nome' },
  coords: { 'en-US': 'Coordinates', 'pt-BR': 'Coordenadas' },
  altitude: { 'en-US': 'Altitude', 'pt-BR': 'Altitude' },
  getCoords: { 'en-US': 'Copy coordinates', 'pt-BR': 'Copiar coordenadas' },
});

const validators = {
  name: (value: string) => z.string({
    required_error: translator.translate('invalidName'),
    invalid_type_error: translator.translate('invalidName'),
  }).parse(value),
  coords: zodCoordinateValidator,
  altitude: (value: string) => (value === '' ? null : zodAltitudeValidator(value)),
};

const initFormData = {
  name: '',
  coords: '',
  altitude: '',
};

const initForms = (onMapClick: React.MouseEventHandler): IInput[] => ([
  {
    id: 'route-name',
    type: inputTypes.text as const,
    name: 'name' as const,
    label: translator.translate('name'),
  },
  {
    id: 'route-coords',
    type: inputTypes.text as const,
    name: 'coords' as const,
    label: translator.translate('coords'),
    labelSideComponent: (
      <button className={classes.ViewMapIcon} onClick={onMapClick}>
        <GlobeIcon width="15"/>
      </button>
    ),
  },
  {
    id: 'route-altitude',
    type: inputTypes.text as const,
    name: 'altitude' as const,
    label: translator.translate('altitude'),
  },
]);

const labelStyle = {
  color: styles.colors.lightGrey,
  fontSize: '0.9rem',
  maxWidth: '265px',
};

const StyledPopup = styled(Popup)`
.leaflet-popup-content-wrapper {
  background-color: black;
}
.leaflet-popup-tip {
  background-color: black;
}`;

const Search = ({ onSearch }: {onSearch: (search: string) => void}) => {
  const map = useMap();
  useEffect(() => {
    const marker = new Icon({
      iconUrl: LocationPin,
      iconSize: [32, 32],
    });
    const searchControl = GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      showMarker: true,
      showPopup: false,
      popupFormat: ({ query }: any) => {
        onSearch(String(query.query));
        map.closePopup();
        return '';
      },
      marker: {
        icon: marker,
        draggable: false,
      },
    });

    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onSearch]);

  return null;
};

const GetMapCoordsPopup = ({ onCoords }: {onCoords: OnCoordHandler}) => {
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const degMinSecCoords = useMemo(() => (
    coords
      ? decimalCoordinatesToDegMinSec({ lat: coords.lat, lon: coords.lng })
      : null
  ), [coords]);
  const map = useMapEvents({
    click: (e) => {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  const onClick = useCallback(() => {
    if (degMinSecCoords && coords) {
      onCoords({
        decimal: { lat: coords.lat, lon: coords.lng },
        degMinSec: degMinSecCoords,
      });
      map.closePopup();
    }
  }, [degMinSecCoords, coords, map, onCoords]);

  return (
    coords
      ? (
        <StyledPopup
          position={coords}
        >
          <div>
            <div style={{
              display: 'flex', gap: '0.5em', paddingBottom: '0.5em', color: 'white',
            }}>
              <div>
                <LatLonIcon width="15"/>
              </div>
              {degMinSecCoords}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ButtonClient onClick={onClick}>
                {translator.translate('getCoords')}
              </ButtonClient>
            </div>
          </div>
        </StyledPopup>
      )
      : null
  );
};

const AddWaypointModal = ({ onSubmit }: { onSubmit: (data: Omit<UserWaypointAdded, 'addAfter'>) => void}) => {
  const closeModal = modalStore((state) => state.closeModal);
  const [searched, setSearched] = useState<string>('');
  const [showMap, setShowMap] = useState(false);
  const onMapClick = useCallback(() => {
    setShowMap(true);
  }, []);
  const forms = useMemo(() => initForms(onMapClick), [onMapClick]);

  const {
    onChange,
    inputs,
    validate,
    isFormsValid,
    setFormData,
  } = useForms({
    formData: initFormData,
    inputs: forms,
    validation: validators,
  });

  const onSearch = useCallback((query: string) => {
    setSearched(query.split(',')[0].trim());
  }, []);

  const onCoords = useCallback<OnCoordHandler>((data) => {
    setFormData((state) => ({
      ...state,
      name: state.name || searched,
      coords: data.degMinSec,
    }));
    setShowMap(false);
  }, [setFormData, searched]);

  const onEditClick = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = validate();
    if (isFormsValid()) {
      onSubmit(parsed);
      closeModal();
    }
  }, [onSubmit, closeModal, isFormsValid, validate]);

  if (showMap) {
    return (
      <div className={classes.MapWrapper}>
        <OSMap>
          <Search onSearch={onSearch}/>
          <GetMapCoordsPopup onCoords={onCoords}/>
        </OSMap>
      </div>
    );
  }
  return (
    <GenericModal title={translator.translate('title')}>
      <div className={classes.Wrapper}>
        <form className={classes.Form}>
          {
            inputs.map((f) => (
              <Input
                key={f.name}
                {...f}
                onChange={onChange}
                styleType='transparent'
                labelStyle={labelStyle}
                wrapperClassName={classes.InputWrapper}
              />
            ))
          }
        </form>
        <div className={classes.ButtonWrapper}>
          <ModalEnterBtn onClick={onEditClick}>
            {translator.translate('btn')}
          </ModalEnterBtn>
        </div>
      </div>
    </GenericModal>
  );
};

export default AddWaypointModal;
