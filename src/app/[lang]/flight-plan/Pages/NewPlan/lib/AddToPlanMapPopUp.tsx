import React, { useCallback, useMemo, useState } from 'react';
import {
  Popup,
  useMapEvents,
} from 'react-leaflet';
import LatLonIcon from '@icons/lat-lon.svg';
import styled from 'styled-components';
import Translator from '../../../../../../utils/Translate/Translator';
import { decimalCoordinatesToDegMinSec } from '../../../../../../utils/converters/coordinates';
import ButtonClient from '../../../../../../components/Buttons/ButtonClient';

const translator = new Translator({
  'getCoords': { 'en-US': 'Copy coordinates', 'pt-BR': 'Copiar coordenadas' },
});

const StyledPopup = styled(Popup)`
.leaflet-popup-content-wrapper {
  background-color: black;
}
.leaflet-popup-tip {
  background-color: black;
}`;

const AddToFlighPlanPopUp = () => {
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const degMinSecCoords = useMemo(() => (
    coords
      ? decimalCoordinatesToDegMinSec({ lat: coords.lat, lon: coords.lng })
      : null
  ), [coords]);
  const map = useMapEvents({
    contextmenu: (e) => {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  const onClick = useCallback(() => {
    if (degMinSecCoords) {
      navigator.clipboard.writeText(degMinSecCoords);
      map.closePopup();
    }
  }, [degMinSecCoords, map]);

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

export default AddToFlighPlanPopUp;
