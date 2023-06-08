import { ParsedForms } from '../../../../../../../hooks/Forms/useForm';
import { TAerodromeData } from '../../../../../../../types/app/aerodrome';
import ConditionalMerger from '../../../../../../../utils/Array/ConditionalMerger';
import { RouteWaypoint, TWaypoint } from '../../../../../../../utils/Route/Route';
import { newFlightPlanAcftFormData } from '../forms';
import { TUserAddedWaypoint } from '../types';
import { newFlightPlanAcftValidator } from '../validation';
import { aerodromeToRouteWaypoint } from './aerodromeToWaypoint';

const makeInitialWaypoints = (
  departure: TAerodromeData | null,
  arrival: TAerodromeData | null,
  alternate: TAerodromeData | null,
  acftData: ParsedForms<typeof newFlightPlanAcftFormData, typeof newFlightPlanAcftValidator>,
) => ([
  aerodromeToRouteWaypoint({ ad: departure, acftData, fixed: true }),
  aerodromeToRouteWaypoint({ ad: arrival, acftData, fixed: true }),
  aerodromeToRouteWaypoint({
    ad: alternate, acftData, fixed: true, alternate: true,
  }),
].filter((wp) => wp) as RouteWaypoint[]);

const mergeWithUserAddedWaypoints = (
  aerodromeWaypoints: RouteWaypoint[],
  userAddedWpts: TUserAddedWaypoint[],
  acftData: ParsedForms<typeof newFlightPlanAcftFormData, typeof newFlightPlanAcftValidator>,
) => {
  const merger = new ConditionalMerger(
    aerodromeWaypoints,
    userAddedWpts,
    (w, uw) => w.name === uw.addAfter,
  );
  merger.insertOffset(1);
  return merger.merge((ua) => (
    new RouteWaypoint({
      name: ua.name,
      type: ua.type,
      coord: ua.coord,
      windSpeed: null,
      windDirection: null,
      ias: acftData?.ias || 0,
      altitude: ua.altitude,
      fixed: ua.fixed,
      alternate: false,
    })
  ));
};

const setUserEditedDataToWaypoints = (
  waypoints: RouteWaypoint[],
  userEditedWaypoints: TWaypoint[],
) => {
  let firstAlternateIndex = -1;
  let lastValidWindValue: {windSpeed: number, windDirection: number} | null = null;
  waypoints.forEach((w, i) => {
    const userEdited = userEditedWaypoints.find((ue) => ue.name === w.name);
    if (userEdited) {
      w.merge(userEdited);
    }
    if (w.alternate && firstAlternateIndex === null) {
      firstAlternateIndex = i;
    }
    if (firstAlternateIndex >= i) {
      w.alternate = true;
    }
    if (typeof w.windDirection === 'number' && typeof w.windSpeed === 'number') {
      lastValidWindValue = { windDirection: w.windDirection, windSpeed: w.windSpeed };
    }
    if (
      lastValidWindValue
      && w.windDirection === null
      && w.windSpeed === null
    ) {
      w.windDirection = lastValidWindValue.windDirection;
      w.windSpeed = lastValidWindValue.windSpeed;
    }
  });
};

export const getRouteWaypoints = ({
  arrival,
  departure,
  alternate,
  acftData,
  userAddedWpts,
  userEditedWaypoints,
}: {
  arrival: TAerodromeData | null
  departure: TAerodromeData | null
  alternate: TAerodromeData | null
  acftData: ParsedForms<typeof newFlightPlanAcftFormData, typeof newFlightPlanAcftValidator>,
  userAddedWpts: TUserAddedWaypoint[],
  userEditedWaypoints: TWaypoint[]
}) => {
  if (!departure || !arrival) return null;
  const aerodromeWaypoints = makeInitialWaypoints(
    departure,
    arrival,
    alternate,
    acftData,
  );

  const waypoints = mergeWithUserAddedWaypoints(
    aerodromeWaypoints,
    userAddedWpts,
    acftData,
  );

  setUserEditedDataToWaypoints(
    waypoints,
    userEditedWaypoints,
  );

  return waypoints;
};
