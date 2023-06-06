'use client';

import React, {
  useCallback,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useQueryClient } from '@tanstack/react-query';
import Translator from '../../../utils/Translate/Translator';
import { findAircraft, saveAircraft } from '../../../Http/requests/acft';
import classes from './SearchAircraft.module.css';
import alertStore from '../../../store/alert/alertStore';
import { ACFT_IMG_URL } from '../../../consts/urls';
import { formatAcftRegistration } from '../../../utils/Acft/acft';
import Input from '../../../components/Forms/Input/Input';
import RotaerLoadingSpinner from '../../../components/Loading/RotaerLoadingSpinner';
import { WithStrId } from '../../../types/app/mongo';
import { API_ROUTES } from '../../../Http/routes';
import { useNextAuth } from '../../../hooks/Auth/useAuth';

const MagnifierIcon = dynamic(() => import('@icons/search-magnifier.svg')) as SVGComponent;
const ButtonClient = dynamic(() => import('../../../components/Buttons/ButtonClient'));
const ImgPlaceholder = dynamic(() => import('../../../components/Icons/NoData/ImgPlaceholder'));
const GridObjectTable = dynamic(() => import('../../../components/GridObjectTable/GridObjectTable'));

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
  cancelDate: { 'pt-BR': 'Data de cancelamento', 'en-US': 'Cancelation date' },
});

const alertsTranslator = new Translator({
  acftNotFound: { 'pt-BR': 'Aeronave não encontrada.', 'en-US': 'Aircraft not found.' },
  acftSaveMustBeLoggedIn: { 'pt-BR': 'Você deve estar logado para salvar aeronaves', 'en-US': 'You must be logged in to save aircrafts.' },
});

const aircraftTableValueFormatter = <K extends keyof IAcft>(k: K | '_id', v: IAcft[K]): string => {
  if (k === 'registration') return formatAcftRegistration(v);
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return `${v.slice(8, 10)}/${v.slice(5, 7)}/${v.slice(0, 4)}`;
  return v;
};
const aircraftTableKeyFormatter = <K extends keyof IAcft>(k: K | '_id'): string => (
  k === '_id' ? k : aircraftTableTranslator.capitalize().translate(k)
);

const validateInput = (value: string) => {
  const valueStripped = value.replace(/[^A-Z]/gi, '');
  if (/^[A-Z]{5}$/i.test(valueStripped)) return true;
  return false;
};

const AircraftSearch = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useNextAuth();
  const setAlert = alertStore((state) => state.setAlert);
  const [loading, setLoading] = useState(false);
  const [imgSuccess, setImgSuccess] = useState(true);
  const [inputValid, setInputValid] = useState<undefined | boolean>(undefined);
  const regNoInput = useRef<HTMLInputElement | null>(null);
  const [acft, setAcft] = useState<WithStrId<IAcft> | null>(null);

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
      setAlert({ msg: alertsTranslator.translate('acftNotFound'), type: 'error' });
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

  const onAcftSave = useCallback(async () => {
    if (!isAuthenticated) {
      setAlert({ msg: alertsTranslator.translate('acftSaveMustBeLoggedIn'), type: 'error' });
      return;
    }
    if (acft) {
      await saveAircraft({ id: acft._id });
      queryClient.invalidateQueries({ queryKey: [API_ROUTES.aircraft.findUserAcft] });
    }
  }, [isAuthenticated, setAlert, acft, queryClient]);

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
                    imgSuccess && !loading
                      ? (
                        <Image
                          src={ACFT_IMG_URL(acft.registration)}
                          alt={acft.registration}
                          onError={onImgError}
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{ width: '100%', height: 'auto' }}
                          placeholder='empty'
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
      {
        acft
          ? (
            <div className={classes.SaveAcftBtnWrapper}>
              <ButtonClient onClick={onAcftSave}>
                Salvar
              </ButtonClient>
            </div>
          )
          : null
      }
    </div>
  );
};

export default AircraftSearch;
