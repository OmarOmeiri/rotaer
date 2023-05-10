'use client';

import React, {
  Fragment,
  useCallback, useEffect, useRef, useState,
} from 'react';
import MagnifierIcon from '@icons/search-magnifier.svg';
import { WithId } from 'mongodb';
import langStore from '../../../store/lang/langStore';
import Translator from '../../../utils/Translate/Translator';
import { findAircraft } from '../../../Http/requests/acft';
import classes from './SearchAircraft.module.css';
import RotaerLoadingSpinner from '../../../components/Loading/RotaerLoadingSpinner';
import { Input } from '../../../components/Forms/Input';
import GridObjectTable from '../../../components/GridObjectTable/GridObjectTable';
import ImgPlaceholder from '../../../components/Icons/NoData/ImgPlaceholder';
import alertStore from '../../../store/alert/alertStore';

const formatAcftRegistration = (id: string) => `${id.slice(0, 2)}-${id.slice(2, 5)}`;
const IMG_URL = (id: string) => `https://rotaer.s3.amazonaws.com/acft-img/${formatAcftRegistration(id)}.jpg`;

const translator = new Translator({
  regNo: { 'pt-BR': 'Matrícula', 'en-US': 'Registration Nº.' },
  owner: { 'pt-BR': 'Proprietário', 'en-US': 'Owner' },
  operator: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  snNo: { 'pt-BR': 'Número de série', 'en-US': 'Serial Nº.' },
  type: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  model: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  manufacturer: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  minCrew: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  maxPax: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  year: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  cvaValidDate: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  caValidDate: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  regDate: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  gravame: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  cancelDate: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  invalidRegNo: { 'pt-BR': 'Matrícula inválida', 'en-US': 'Invalid registration' },
});

const aircraftTableTranslator = new Translator({
  registration: { 'pt-BR': 'Matrícula', 'en-US': 'Registration' },
  owner: { 'pt-BR': 'Proprietário', 'en-US': 'Owner' },
  operator: { 'pt-BR': 'Operador', 'en-US': 'Operator' },
  serialNumber: { 'pt-BR': 'Núm. de série', 'en-US': 'Serial number' },
  type: { 'pt-BR': 'Tipo', 'en-US': 'Type' },
  model: { 'pt-BR': 'Modelo', 'en-US': 'Model' },
  manufacturer: { 'pt-BR': 'Fabricante', 'en-US': 'Manufacturer' },
  minCrew: { 'pt-BR': 'Tripulação mínima', 'en-US': 'Min. Crew' },
  maxPax: { 'pt-BR': 'Passageiros', 'en-US': 'Passengers' },
  year: { 'pt-BR': 'Ano', 'en-US': 'Year' },
  cvaValidDate: { 'pt-BR': 'Validade CVA.', 'en-US': 'CVA Expiry date' },
  caValidDate: { 'pt-BR': 'Validade CA', 'en-US': 'CA Expiry date' },
  registrationDate: { 'pt-BR': 'Data de registro', 'en-US': 'Registraton date' },
  gravame: { 'pt-BR': 'GRAVAME', 'en-US': 'GRAVAME' },
  cancelDate: { 'pt-BR': 'GRAVAME', 'en-US': 'GRAVAME' },
});

const aircraftTableValueFormatter = <K extends keyof IAcft>(k: K | '_id', v: IAcft[K]): string => (
  k === 'registration' ? formatAcftRegistration(v) : v
);
const aircraftTableKeyFormatter = <K extends keyof IAcft>(k: K | '_id'): string => (
  k === '_id' ? k : aircraftTableTranslator.capitalize().translate(k)
);

const validateInput = (value: string) => {
  const valueStripped = value.replace(/[^A-Z]/gi, '');
  if (/^[A-Z]{5}$/i.test(valueStripped)) return true;
  return false;
};

export const AircraftSearch = () => {
  const lang = langStore((state) => state.lang);
  const setAlert = alertStore((state) => state.setAlert);
  const [loading, setLoading] = useState(false);
  const [imgSuccess, setImgSuccess] = useState(true);
  const [inputValid, setInputValid] = useState<undefined | boolean>(undefined);
  const regNoInput = useRef<HTMLInputElement | null>(null);
  const [acft, setAcft] = useState<WithId<IAcft> | null>(null);

  const onSearchClick = useCallback(async () => {
    if (!regNoInput.current) return;
    const { value } = regNoInput.current;
    if (!validateInput(value)) {
      setInputValid(false);
      return;
    }
    setInputValid(true);
    setLoading(true);
    setImgSuccess(true);
    const acft = await findAircraft({ id: value });
    if (!acft) {
      setAlert({ msg: 'Aeronave não encontrada.', type: 'error' });
    }
    setLoading(false);
    setAcft(acft);
  }, [setAlert]);

  const onSearchSubmit = useCallback(async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearchClick();
  }, [onSearchClick]);

  const onImgError = useCallback(async () => {
    setImgSuccess(false);
  }, []);

  return (
    <div>
      <div className={classes.InputContainer}>
        <Input
          name='acftRegNo'
          styleType="transparent"
          label={translator.translate('regNo')}
          ref={regNoInput}
          inputClassName={classes.Input}
          onKeyDown={onSearchSubmit}
          valid={inputValid}
          validationMsg={translator.translate('invalidRegNo')}
        />
        {
          loading
            ? (
              <div className={classes.LoadingIconContainer}>
                <RotaerLoadingSpinner width="30"/>
              </div>
            )
            : (
              <button className={classes.SearchBtn} onClick={onSearchClick}>
                <MagnifierIcon width="15"/>
              </button>
            )
        }
      </div>
      <div className={classes.AcftDataContainer}>
        {
          acft
            ? (
              <>
                <GridObjectTable
                obj={acft}
                omit={(k, v) => ['_id', '__v'].includes(k) || typeof v === 'undefined' || v === null}
                keyFormatter={aircraftTableKeyFormatter}
                valueFormatter={aircraftTableValueFormatter}
                className={classes.AcftTable}
              />
                <div className={classes.ImgPlaceholder}>
                  {
                    imgSuccess
                      ? (
                        <img
                          src={IMG_URL(acft.registration)}
                          alt={acft.registration}
                          onError={onImgError}
                        />
                      )
                      : <ImgPlaceholder height={225} width={400}/>
                  }
                </div>
              </>
            )
            : null
        }
      </div>
    </div>
  );
};

