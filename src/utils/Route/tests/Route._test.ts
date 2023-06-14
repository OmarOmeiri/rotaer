import { Route, RouteWaypoint } from '../Route';
import { fullTestRoute, fullTestRouteWithAlternateWaypoint, makeTestRoute } from './routes';

const acft = {
  ias: 61,
  climbFuelFlow: 30,
  descentFuelFlow: 20,
  cruiseFuelFlow: 25,
  climbRate: 350,
  descentRate: 500,
  usableFuel: 98,
};

const route1 = makeTestRoute(['SBBI', 'Colombo', 'RioBranco', 'CpoMagro', 'SJOY', 'SSCF']);

const test = (waypoints: RouteWaypoint[]) => {
  const route = new Route(waypoints, acft);
  const legs = route.getLegs();
  console.log(JSON.stringify(route.getVerticalProfile()?.getPoints(), null, 2));
};

test(fullTestRouteWithAlternateWaypoint);
