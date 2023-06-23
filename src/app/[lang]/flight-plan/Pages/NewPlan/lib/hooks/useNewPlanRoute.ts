import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { objHasProp } from 'lullo-utils/Objects';
import { cloneDeep } from 'lodash';
import type { ParsedForms } from '../../../../../../../hooks/Forms/useForm';
import type { TAerodromeData } from '../../../../../../../types/app/aerodrome';
import type { FlightPlan } from '../../../../../../../types/app/fPlan';
import type { WithStrId } from '../../../../../../../types/app/mongo';
import { Route, RouteWaypoint, type TWaypoint } from '../../../../../../../utils/Route/Route';
import type { newFlightPlanAcftFormData } from '../forms';
import type { TUserAddedWaypoint } from '../types';
import { userWaypointInputValidators, type newFlightPlanAcftValidator } from '../validation';
import { makeRouteWaypoints, makeUserRouteWaypoints } from '../utils/getWaypoints';
import { getZodErrorMessage } from '../../../../../../../frameworks/zod/zodError';
import type alertStore from '../../../../../../../store/alert/alertStore';
import type { OnUserWaypointEdit, UserWaypointAdded } from '../../../../types';

const makeUserRoute = ({
  userLoadedPlan,
  departure,
  arrival,
  alternate,
}:{
  userLoadedPlan: WithStrId<FlightPlan>,
  departure: TAerodromeData | null,
  arrival: TAerodromeData | null,
  alternate: TAerodromeData | null,
}) => {
  const aerodromeNames = [departure, arrival, alternate]
    .map((a) => a?.icao)
    .filter((a) => a);
  return userLoadedPlan.route.reduce((r, w, i) => {
    if (aerodromeNames.includes(w.name)) {
      r.route.push(w);
    } else {
      const last = userLoadedPlan.route[i - 1];
      r.userAdded.push({
        ...w,
        addAfter: last.name,
      });
    }
    return r;
  }, {
    route: [],
    userAdded: [],
  } as {
    route: TWaypoint[],
    userAdded: TUserAddedWaypoint[]
  });
};

const useNewPlanRoute = ({
  userLoadedPlan,
  departure,
  arrival,
  alternate,
  parsedAcftData,
  setAlert,
}:{
  userLoadedPlan: WithStrId<FlightPlan> | null,
  departure: TAerodromeData | null,
  arrival: TAerodromeData | null,
  alternate: TAerodromeData | null,
  parsedAcftData: ParsedForms<typeof newFlightPlanAcftFormData, typeof newFlightPlanAcftValidator>
  setAlert: ReturnType<typeof alertStore['getState']>['setAlert'],
}) => {
  const [userEditedWaypoints, setUserEditedWaypoints] = useState<TWaypoint[]>([]);
  const [userAddedWpts, setUserAddedWpts] = useState<TUserAddedWaypoint[]>([]);
  console.log('userAddedWpts: ', userAddedWpts);
  const [userRoute, setUserRoute] = useState<TWaypoint[]>([]);
  console.log('userRoute: ', userRoute);

  useEffect(() => {
    if (userLoadedPlan && departure && arrival) {
      const { route, userAdded } = makeUserRoute({
        userLoadedPlan,
        departure,
        arrival,
        alternate,
      });
      setUserAddedWpts(userAdded);
      setUserRoute(route);
    }
  }, [
    userLoadedPlan,
    departure,
    arrival,
    alternate,
  ]);

  const waypoints = useMemo(() => {
    if (userLoadedPlan) {
      if (!userRoute.length) return null;
      return makeUserRouteWaypoints({
        route: userRoute,
        acftData: parsedAcftData,
        userAddedWpts,
        userEditedWaypoints,
        departure,
        arrival,
        alternate,
      });
    }
    return makeRouteWaypoints({
      departure,
      arrival,
      alternate,
      acftData: parsedAcftData,
      userEditedWaypoints,
      userAddedWpts,
    });
  }, [
    userLoadedPlan,
    userRoute,
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
    if (!route || !waypoints) return;

    const wptNames = waypoints
      .map((w) => w.name)
      .filter((wn) => wn !== name);

    setUserAddedWpts((wpts) => {
      const clone = cloneDeep(wpts)
        .filter((w) => w.name !== name);

      return clone.reduce((wpts, w) => {
        const beforeIndex = wptNames.findIndex((wn) => wn === w.name) - 1;
        if (beforeIndex < 0) return wpts;
        wpts.push({
          ...w,
          addAfter: wptNames[beforeIndex],
        });
        return wpts;
      }, [] as TUserAddedWaypoint[]);
    });
  }, [waypoints, route]);

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

  return {
    waypoints,
    route,
    legs,
    onEditableContentBlur,
    onWaypointAdd,
    onWaypointDelete,
    onWaypointOrderChange,
  };
};

export default useNewPlanRoute;
