import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { cloneDeep } from 'lodash';
import { objHasProp } from 'lullo-utils/Objects';
import OSMap from '../../../../components/Map/OpenStreetMap/OSMap';
import NewFlightPlanAcft from '../components/newFlightPlan/NewFlightPlanAcft';
import NewFlightPlanInfo from '../components/newFlightPlan/NewFlightPlanInfo';
import classes from '../styles/NewFlightPlan.module.css';
import { useForms } from '../../../../hooks/Forms/useForm';
import {
  newFlightPlanAcftFormData,
  newFlightPlanAcftForms,
  newFlightPlanInfoFormData,
  newFlightPlanInfoForms,
} from '../forms/newFlightPlan';
import NewFlightPlanRoute from '../components/newFlightPlan/NewFlightPlanRoute';
import { fetchAerodromeInfo } from '../../../../Http/requests/aerodrome';
import { zodAdIcaoValidator } from '../../../../frameworks/zod/zodAerodrome';
import { TAerodromeData } from '../../../../types/app/aerodrome';
import Translator from '../../../../utils/Translate/Translator';
import { useNextAuth } from '../../../../hooks/Auth/useAuth';
import { Route, RouteWaypoint, TWaypoint } from '../../../../utils/Route/Route';
import { useAcftQuery } from '../../../../frameworks/react-query/queries/acft';
import { formatAcftRegistration } from '../../../../utils/Acft/acft';
import {
  acftClimbRateValidator, acftDescentRateValidator, acftFuelFlowValidator, acftIASValidator, acftUsableFuelValidator,
} from '../../../../frameworks/zod/zodAcft';
import { WithStrId } from '../../../../types/app/mongo';
import alertStore from '../../../../store/alert/alertStore';
import { editUserAircraft } from '../../../../Http/requests/acft';
import { FlightPlanEditableIds } from '../types';
import { LengthConverter } from '../../../../utils/converters/length';
import { userWaypointInputValidators } from '../forms/userWaypointInputValidation';
import { getZodErrorMessage } from '../../../../frameworks/zod/zodError';

const translator = new Translator({
  adNotFound: { 'en-US': 'Aerodrome not found', 'pt-BR': 'Aeródromo não encontrado' },
  invalidAcft: { 'en-US': 'Aircraft data is not valid.', 'pt-BR': 'Aeronave inválida.' },
  acftSave: { 'en-US': 'Aircraft saved successfully.', 'pt-BR': 'Aeronave salva com sucesso.' },
  acftSaveFail: { 'en-US': 'Could not save aircraft data.', 'pt-BR': 'Houve um erro ao salvar a aeronave.' },
});

const flightInfoValidators = {
  name: () => true,
  dep: (value: string) => (value ? (
    zodAdIcaoValidator(value)
  ) : value),
  arr: (value: string) => (value ? (
    zodAdIcaoValidator(value)
  ) : value),
  altrn: (value: string) => (value ? (
    zodAdIcaoValidator(value)
  ) : value),
};

const acftValidator = {
  ias: acftIASValidator,
  climbFuelFlow: acftFuelFlowValidator,
  descentFuelFlow: acftFuelFlowValidator,
  cruiseFuelFlow: acftFuelFlowValidator,
  climbRate: acftClimbRateValidator,
  descentRate: acftDescentRateValidator,
  usableFuel: acftUsableFuelValidator,
};

const hasUserChangedAcftData = (
  originalAcft: WithStrId<IUserAcft>,
  formData: {
    ias: number | undefined;
    climbFuelFlow: number | undefined;
    descentFuelFlow: number | undefined;
    cruiseFuelFlow: number | undefined;
    climbRate: number | undefined;
    descentRate: number | undefined;
    usableFuel: number | undefined;
},
) => (
  Object.entries(formData).some(([k, v]) => v !== originalAcft[k as keyof typeof originalAcft])
);

const aerodromeToWaypoint = ({
  ad,
  acftData,
  fixed,
  alternate,
}: {
  ad: TAerodromeData | null,
  acftData: {
    ias: number | undefined
    climbRate: number | undefined
    descentRate: number | undefined
    usableFuel: number | undefined
    climbFuelFlow: number | undefined
    cruiseFuelFlow: number | undefined
    descentFuelFlow: number | undefined
  },
  fixed?: boolean,
  alternate?: boolean,
}): RouteWaypoint | null => (
  ad
    ? new RouteWaypoint({
      name: ad.icao,
      coord: ad.coords,
      windSpeed: 0,
      windDirection: 0,
      speed: acftData?.ias || 0,
      altitude: Math.round(LengthConverter.M(ad.elev).toFt() + 1000),
      fixed: fixed || false,
      alternate: alternate || false,
    })
    : null
);

const NewPlan = () => {
  const session = useNextAuth();
  const setAlert = alertStore((state) => state.setAlert);
  const [selectedAcft, setSelectedAcft] = useState<WithStrId<IUserAcft> | null>(null);
  const [userAddedWpts, setUserAddedWpts] = useState<TWaypoint[]>([]);
  const [departure, setDeparture] = useState<TAerodromeData | null>(null);
  const [arrival, setArrival] = useState<TAerodromeData | null>(null);
  const [alternate, setAlternate] = useState<TAerodromeData | null>(null);
  const [userEditedWaypoints, setUserEditedWaypoints] = useState<TWaypoint[]>([]);
  const acftQuery = useAcftQuery(session);

  const {
    inputs: flightInfoInputs,
    formData: flightInfoFData,
    onChange: onNewFlightInfoChange,
    setInputs: setNewFlightPlanInfoInputs,
    isFormsValid: isFlightInfoValid,
    validate: validateFlightInfo,
  } = useForms({
    formData: newFlightPlanInfoFormData,
    inputs: newFlightPlanInfoForms,
    validation: flightInfoValidators,
  });

  const {
    inputs: flightPlanAcftInputs,
    formData: acftFormData,
    manualFormDataChange: setAcftFormData,
    onChange: onFlightPlanAcftChange,
    parse: parseAcftData,
    validate: validateAcftData,
    isFormsValid: isAcftValid,
  } = useForms({
    formData: newFlightPlanAcftFormData,
    inputs: newFlightPlanAcftForms,
    validation: acftValidator,
    validateOnBlur: true,
  });

  const acftDropDownItems = useMemo(() => (
    (acftQuery.data || []).map((a) => ({
      value: formatAcftRegistration(a.registration),
      id: a._id,
    }))
  ), [acftQuery.data]);

  const onAcftChange = useCallback((id: string) => {
    const selectedAcft = (acftQuery.data || [])
      .find((a) => a._id === id);
    if (!selectedAcft) return;
    setAcftFormData(() => selectedAcft);
    setSelectedAcft(selectedAcft);
  }, [acftQuery.data, setAcftFormData]);

  const onAcftSave = useCallback(async () => {
    const parsed = validateAcftData();
    if (isAcftValid() && selectedAcft) {
      try {
        await editUserAircraft({
          ...selectedAcft,
          ...parsed,
        });
        setAlert({ msg: translator.translate('acftSave'), type: 'success' });
        acftQuery.invalidate();
      } catch {
        setAlert({ msg: translator.translate('acftSaveFail'), type: 'error' });
      }
    } else {
      setAlert({ msg: translator.translate('invalidAcft'), type: 'error' });
    }
  }, [isAcftValid, selectedAcft, setAlert, validateAcftData, acftQuery]);

  const parsedAcftData = useMemo(() => (
    parseAcftData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [selectedAcft, parseAcftData]);

  const waypoints = useMemo(() => {
    if (!departure || !arrival) return null;
    const wps = ([
      aerodromeToWaypoint({ ad: departure, acftData: parsedAcftData, fixed: true }),
      ...userAddedWpts,
      aerodromeToWaypoint({ ad: arrival, acftData: parsedAcftData, fixed: true }),
      aerodromeToWaypoint({
        ad: alternate, acftData: parsedAcftData, fixed: true, alternate: true,
      }),
    ].filter((wp) => wp) as RouteWaypoint[]);

    wps.forEach((w, i) => {
      if (userEditedWaypoints[i]) {
        w.merge(userEditedWaypoints[i]);
      }
    });
    return wps;
  }, [
    departure,
    arrival,
    alternate,
    parsedAcftData,
    userEditedWaypoints,
    userAddedWpts,
  ]);

  const route = useMemo(() => {
    if (!waypoints) return null;
    return new Route(waypoints);
  }, [waypoints]);

  const legs = useMemo(() => (
    route
      ? route.getLegs()
      : []
  ), [route]);

  const changedAcft = useMemo(() => {
    if (!parsedAcftData || !selectedAcft) return false;
    return hasUserChangedAcftData(selectedAcft, parsedAcftData);
  }, [parsedAcftData, selectedAcft]);

  const setFlightInfoValidation = useCallback((id: string, valid: boolean | null, message: string | null) => {
    setNewFlightPlanInfoInputs((state) => state.map(((i) => {
      if (i.id === id) {
        return {
          ...i,
          valid,
          validationMsg: message,
        };
      }
      return i;
    })));
  }, [setNewFlightPlanInfoInputs]);

  const setAerodrome = useCallback((type: keyof typeof flightInfoFData, ad: TAerodromeData | null) => {
    if (type === 'arr') setArrival(ad);
    if (type === 'dep') setDeparture(ad);
    if (type === 'altrn') setAlternate(ad);
  }, []);

  const onDepArrInputBlur = useCallback(async (e: React.FocusEvent) => {
    const { id } = e.target;
    const type = id.split('-')[1] as keyof typeof flightInfoFData;
    const map: {[k: string]: string} = {
      'fplan-dep': flightInfoFData.dep,
      'fplan-arr': flightInfoFData.arr,
      'fplan-altrn': flightInfoFData.altrn,
    };
    const icao = map[id].toUpperCase();
    validateFlightInfo(type);

    if (isFlightInfoValid(type) && icao) {
      const ad = await fetchAerodromeInfo({ id: icao });
      setAerodrome(type, ad || null);
      if (ad) {
        setFlightInfoValidation(id, true, null);
      } else {
        setFlightInfoValidation(id, false, translator.translate('adNotFound'));
      }
    } else if (!icao) {
      setAerodrome(type, null);
      setFlightInfoValidation(id, true, null);
    }
  }, [
    flightInfoFData,
    isFlightInfoValid,
    setFlightInfoValidation,
    setAerodrome,
    validateFlightInfo,
  ]);

  const onEditableContentBlur = useCallback((index: number, id: FlightPlanEditableIds, value: string) => {
    if (!route) return;
    if (!objHasProp(userWaypointInputValidators, [id])) return;

    let validatedValue: Partial<TWaypoint> | undefined;
    let error: string | undefined;
    try {
      const validationFn = userWaypointInputValidators[id];
      validatedValue = validationFn(value, id);
    } catch (e) {
      validatedValue = undefined;
      error = getZodErrorMessage(e);
    }

    if (error) {
      setAlert({ msg: error, type: 'error' });
      return;
    }

    setUserEditedWaypoints((state) => {
      const clone = cloneDeep(state);
      clone[index] = { ...(clone[index] || {}), ...validatedValue };
      return clone;
    });
  }, [route, setAlert]);

  const onWaypointAdd = useCallback((wpt: {altitude: number, coords: {lat: number, lon: number}, name: string}) => {
    setUserAddedWpts([
      new RouteWaypoint({
        name: wpt.name,
        coord: { decimal: wpt.coords } as any,
        windSpeed: 0,
        windDirection: 0,
        speed: parsedAcftData?.ias || 0,
        altitude: wpt.altitude,
        fixed: false,
        alternate: false,
      }),
    ]);
  }, [parsedAcftData]);

  return (
    <div className={classes.Wrapper}>
      <div>
        <NewFlightPlanInfo
          forms={flightInfoInputs}
          onFormChange={onNewFlightInfoChange}
          onAerodromeBlur={onDepArrInputBlur}
        />
        <NewFlightPlanAcft
          forms={flightPlanAcftInputs}
          acftDropDown={acftDropDownItems}
          isChanged={changedAcft}
          onAcftSave={onAcftSave}
          onAcftChange={onAcftChange}
          onFormChange={onFlightPlanAcftChange}
        />
        <NewFlightPlanRoute
          legs={legs}
          onEditableContent={onEditableContentBlur}
          onWaypointAdd={onWaypointAdd}
        />
      </div>
      <div className={classes.MapWrapper}>
        <OSMap className={classes.Map}/>
      </div>
    </div>
  );
};

export default NewPlan;

