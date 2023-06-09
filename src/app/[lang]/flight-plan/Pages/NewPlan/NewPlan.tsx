import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { cloneDeep } from 'lodash';
import { objHasProp } from 'lullo-utils/Objects';
import OSMap from '../../../../../components/Map/OpenStreetMap/OSMap';
import NewFlightPlanAcft from './lib/NewFlightPlanAcft';
import NewFlightPlanInfo from './lib/NewFlightPlanInfo';
import classes from './NewFlightPlan.module.css';
import { useForms } from '../../../../../hooks/Forms/useForm';
import {
  newFlightPlanAcftFormData,
  newFlightPlanAcftForms,
  newFlightPlanInfoFormData,
  newFlightPlanInfoForms,
} from './lib/forms';
import NewFlightPlanRoute from './lib/FlightPlanRoute';
import { fetchAerodromeInfo } from '../../../../../Http/requests/aerodrome';
import { TAerodromeData } from '../../../../../types/app/aerodrome';
import Translator from '../../../../../utils/Translate/Translator';
import { useNextAuth } from '../../../../../hooks/Auth/useAuth';
import { Route, TWaypoint } from '../../../../../utils/Route/Route';
import { useAcftQuery } from '../../../../../frameworks/react-query/queries/acft';
import { formatAcftRegistration } from '../../../../../utils/Acft/acft';
import { WithStrId } from '../../../../../types/app/mongo';
import alertStore from '../../../../../store/alert/alertStore';
import { editUserAircraft } from '../../../../../Http/requests/acft';
import { OnUserWaypointEdit, UserWaypointAdded } from '../../types';
import { flightPlanInfoValidators, newFlightPlanAcftValidator, userWaypointInputValidators } from './lib/validation';
import { getZodErrorMessage } from '../../../../../frameworks/zod/zodError';
import AddToFlighPlanPopUp from './lib/AddToPlanMapPopUp';
import OSPolyLine from '../../../../../components/Map/OpenStreetMap/OSPolyLine';
import { TUserAddedWaypoint } from './lib/types';
import { getRouteWaypoints } from './lib/utils/getWaypoints';
import CardWithTitle from '../../../../../components/Card/CardWithTitle';
import FlightPlanAerodromeData from './lib/FlightPlanAerodromeData';
import FlightPlanFuel from './lib/FlightPlanFuel';

const translator = new Translator({
  adNotFound: { 'en-US': 'Aerodrome not found', 'pt-BR': 'Aeródromo não encontrado' },
  invalidAcft: { 'en-US': 'Aircraft data is not valid.', 'pt-BR': 'Aeronave inválida.' },
  acftSave: { 'en-US': 'Aircraft saved successfully.', 'pt-BR': 'Aeronave salva com sucesso.' },
  acftSaveFail: { 'en-US': 'Could not save aircraft data.', 'pt-BR': 'Houve um erro ao salvar a aeronave.' },
  map: { 'en-US': 'Map', 'pt-BR': 'Mapa' },
});

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

const NewPlan = () => {
  const session = useNextAuth();
  const setAlert = alertStore((state) => state.setAlert);
  const [selectedAcft, setSelectedAcft] = useState<WithStrId<IUserAcft> | null>(null);
  const [userAddedWpts, setUserAddedWpts] = useState<TUserAddedWaypoint[]>([]);
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
    validation: flightPlanInfoValidators,
  });

  const {
    inputs: flightPlanAcftInputs,
    manualFormDataChange: setAcftFormData,
    onChange: onFlightPlanAcftChange,
    parse: parseAcftData,
    validate: validateAcftData,
    isFormsValid: isAcftValid,
  } = useForms({
    formData: newFlightPlanAcftFormData,
    inputs: newFlightPlanAcftForms,
    validation: newFlightPlanAcftValidator,
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

  const waypoints = useMemo(() => getRouteWaypoints({
    departure,
    arrival,
    alternate,
    acftData: parsedAcftData,
    userEditedWaypoints,
    userAddedWpts,
  }), [
    departure,
    arrival,
    alternate,
    parsedAcftData,
    userEditedWaypoints,
    userAddedWpts,
  ]);

  const route = useMemo(() => {
    if (!waypoints) return null;
    return new Route(waypoints, parsedAcftData);
  }, [waypoints, parsedAcftData]);

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

  const onEditableContentBlur = useCallback<OnUserWaypointEdit>((index, id, value) => {
    if (!route || !waypoints) return;
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

    const wpt = waypoints[index];

    setUserEditedWaypoints((state) => {
      const clone = cloneDeep(state);
      const alreadyEditedIx = clone.findIndex((c) => c.name === wpt.name);
      if (alreadyEditedIx > -1) {
        clone[alreadyEditedIx] = {
          ...clone[alreadyEditedIx],
          ...validatedValue,
        };
      } else {
        clone.push({
          ...waypoints[index],
          ...validatedValue,
        });
      }
      return clone;
    });
  }, [route, waypoints, setAlert]);

  const onWaypointAdd = useCallback((wpt: UserWaypointAdded) => {
    const routeWpt: TUserAddedWaypoint = {
      name: wpt.name,
      type: 'coord',
      coord: wpt.coords,
      windSpeed: 0,
      windDirection: 0,
      ias: parsedAcftData?.ias || 0,
      altitude: wpt.altitude,
      fixed: false,
      alternate: false,
      addAfter: wpt.addAfter,
    };
    setUserAddedWpts((wpts) => [...wpts, routeWpt]);
  }, [parsedAcftData]);

  const onWaypointDelete = useCallback((name: string) => {
    setUserAddedWpts((wpts) => (
      wpts.filter((w) => w.name !== name)
    ));
  }, []);

  const onWaypointOrderChange = (target: string, addAfter: string) => {
    if (!waypoints) return;
    const wNames = waypoints.map((w) => w.name);
    const indexOfTarget = wNames.indexOf(target);
    if (indexOfTarget < 0) return;
    wNames.splice(indexOfTarget, 1);
    const indexOfAfter = wNames.indexOf(addAfter);
    if (indexOfAfter < 0) return;
    wNames.splice(indexOfAfter + 1, 0, target);

    setUserAddedWpts((ua) => (
      ua.map((w) => {
        const beforeIndex = wNames.findIndex((name) => name === w.name) - 1;
        if (beforeIndex < 0) return w;
        w.addAfter = wNames[beforeIndex];
        return w;
      })
    ));
  };

  return (
    <div className={classes.Wrapper}>
      <div className={classes.PlanWrapper}>
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
          onWaypointDelete={onWaypointDelete}
          onWaypointOrderChange={onWaypointOrderChange}
        />
      </div>
      <div className={classes.MapWrapper}>
        <CardWithTitle
          title={translator.translate('map')}
          className={classes.MapCard}
          contentClassName={classes.MapInnerWrapper}
          styled
        >
          <OSMap>
            {
            route
              ? <AddToFlighPlanPopUp/>
              : null
            }
            {
              waypoints
                ? <OSPolyLine waypoints={waypoints}/>
                : null
            }
          </OSMap>
        </CardWithTitle>
      </div>
      <FlightPlanAerodromeData
        arrival={arrival}
        departure={departure}
        alternate={alternate}
      />
      <FlightPlanFuel legs={legs}/>
    </div>
  );
};

export default NewPlan;

