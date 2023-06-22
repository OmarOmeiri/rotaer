import React, {
  useCallback,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import OSMap from '../../../../../components/Map/OpenStreetMap/OSMap';
import NewFlightPlanAcft from './lib/NewFlightPlanAcft';
import NewFlightPlanInfo from './lib/NewFlightPlanInfo';
import classes from './NewFlightPlan.module.css';
import NewFlightPlanRoute from './lib/FlightPlanRoute';
import { TAerodromeData } from '../../../../../types/app/aerodrome';
import { useNextAuth } from '../../../../../hooks/Auth/useAuth';
import alertStore from '../../../../../store/alert/alertStore';
import AddToFlighPlanPopUp from './lib/AddToPlanMapPopUp';
import OSPolyLine from '../../../../../components/Map/OpenStreetMap/OSPolyLine';
import CardWithTitle from '../../../../../components/Card/CardWithTitle';
import FlightPlanAerodromeData from './lib/FlightPlanAerodromeData';
import FlightPlanFuel from './lib/FlightPlanFuel';
import { FlightPlanWeather } from './lib/FlightPlanWeather';
import FlightPlanVerticalProfile from './lib/FlightPlanVerticalProfile';
import { editUserFlightPlan, saveUserFlightPlan } from '../../../../../Http/requests/flightPlan';
import { useFlightPlansQuery } from '../../../../../frameworks/react-query/queries/flightPlan';
import useNewPlanForms from './lib/hooks/useNewPlanForms';
import newFlightPlanTranslator from './lib/utils/newPlanTranslator';
import useNewPlanUserLoaded from './lib/hooks/useNewPlanUserLoaded';
import useNewPlanAcft from './lib/hooks/useNewPlanAcft';
import useNewPlanRoute from './lib/hooks/useNewPlanRoute';
import { newFlightPlanInfoFormData } from './lib/forms';
import { TLeg, TWaypoint } from '../../../../../utils/Route/Route';
import useFlightPlanPrint from './lib/hooks/useFlightPlanPrint';
import FlightPlanPrinter from './lib/FlightPlanPrinter';

const savePlan = async ({
  id,
  action,
  flightInfoFData,
  departure,
  arrival,
  alternate,
  routeObj,
  setAlert,
}:{
  id: string | null
  action: 'save' | 'edit' | 'clone'
  flightInfoFData: typeof newFlightPlanInfoFormData
  departure: TAerodromeData,
  arrival: TAerodromeData,
  alternate: TAerodromeData | null,
  routeObj: TWaypoint[],
  setAlert: ReturnType<typeof alertStore['getState']>['setAlert'],
}) => {
  if (!action || action === 'clone' || action === 'save') {
    await saveUserFlightPlan({
      name: flightInfoFData.name || `${departure?.icao} — ${arrival?.icao}`,
      dep: departure.icao,
      arr: arrival.icao,
      alt: alternate?.icao,
      route: routeObj,
    }, {
      onError: () => newFlightPlanTranslator.translate('couldNotSave'),
      onSuccess: () => { setAlert({ msg: newFlightPlanTranslator.translate('saved'), type: 'success' }); },
    });
    setAlert({
      msg: action === 'clone'
        ? newFlightPlanTranslator.translate('cloned')
        : newFlightPlanTranslator.translate('saved'),
      type: 'success',
    });
  }
  if (action === 'edit' && id) {
    await editUserFlightPlan({
      id,
      name: flightInfoFData.name || `${departure?.icao} -> ${arrival?.icao}`,
      dep: departure.icao,
      arr: arrival.icao,
      alt: alternate?.icao,
      route: routeObj,
    }, {
      onError: () => newFlightPlanTranslator.translate('couldNotSave'),
      onSuccess: () => { setAlert({ msg: newFlightPlanTranslator.translate('saved'), type: 'success' }); },
    });
  }
};

const NewPlan = () => {
  const session = useNextAuth();
  const params = useSearchParams();
  const planId = params.get('id');
  const setAlert = alertStore((state) => state.setAlert);
  const [departure, setDeparture] = useState<TAerodromeData | null>(null);
  const [arrival, setArrival] = useState<TAerodromeData | null>(null);
  const [alternate, setAlternate] = useState<TAerodromeData | null>(null);
  const userPlansQuery = useFlightPlansQuery(session.user);

  const {
    flightInfoInputs,
    flightInfoFData,
    setFlightInfoFormData,
    onNewFlightInfoChange,
    flightPlanAcftInputs,
    setAcftFormData,
    onFlightPlanAcftChange,
    parseAcftData,
    validateAcftData,
    isAcftValid,
    onDepArrInputBlur,
  } = useNewPlanForms({
    setDeparture,
    setArrival,
    setAlternate,
  });

  const userLoadedPlan = useNewPlanUserLoaded({
    id: planId,
    session,
    setAlert,
    setDeparture,
    setArrival,
    setAlternate,
    setFlightInfoFormData,
  });

  const {
    acftDropDownItems,
    onAcftChange,
    onAcftSave,
    parsedAcftData,
    changedAcft,
    selectedAcft,
  } = useNewPlanAcft({
    session,
    setAcftFormData,
    setAlert,
    validateAcftData,
    isAcftValid,
    parseAcftData,
  });

  const {
    waypoints,
    route,
    legs,
    onEditableContentBlur,
    onWaypointAdd,
    onWaypointDelete,
    onWaypointOrderChange,
  } = useNewPlanRoute({
    userLoadedPlan,
    departure,
    arrival,
    alternate,
    parsedAcftData,
    setAlert,
  });

  const {
    printerRef,
    print,
  } = useFlightPlanPrint();

  const onSave = useCallback(async (action: 'save' | 'edit' | 'clone') => {
    if (!route || !departure || !arrival) {
      setAlert({ msg: newFlightPlanTranslator.translate('noRouteToSave'), type: 'error' });
      return;
    }
    const routeObj = route.toObject();
    try {
      savePlan({
        id: planId,
        action,
        flightInfoFData,
        departure,
        arrival,
        alternate,
        routeObj,
        setAlert,
      });
    } catch (error) {
      setAlert({ msg: newFlightPlanTranslator.translate('couldNotSave'), type: 'error' });
    }
    userPlansQuery.invalidate();
  }, [
    route,
    flightInfoFData,
    departure,
    arrival,
    alternate,
    userPlansQuery,
    planId,
    setAlert,
  ]);

  return (
    <>
      {
      departure
      && arrival
      && legs.length
      && route
        ? (
          <FlightPlanPrinter
            ref={printerRef}
            title={flightInfoFData.name || `${departure?.icao} — ${arrival.icao}`}
            dep={departure}
            arr={arrival}
            alt={alternate}
            selectedAcft={selectedAcft}
            route={route}
          />
        )
        : null
    }

      <div className={classes.Wrapper}>
        <div className={classes.PlanWrapper}>
          <NewFlightPlanInfo
            forms={flightInfoInputs}
            canSave={!!(route)}
            isUserPlan={!!planId}
            onSaveClick={onSave}
            onFormChange={onNewFlightInfoChange}
            onAerodromeBlur={onDepArrInputBlur}
            onPrintClick={print}
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
            title={newFlightPlanTranslator.translate('map')}
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
        <div className={classes.FuelAndWeather}>
          <FlightPlanFuel legs={legs} acftData={parsedAcftData}/>
          <FlightPlanWeather waypoints={waypoints}/>
        </div>
        <FlightPlanVerticalProfile route={route}/>
      </div>
    </>
  );
};

export default NewPlan;

