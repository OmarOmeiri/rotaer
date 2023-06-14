import { RouteWaypoint } from '../Route';

const wayPoints = {
  SBBI: new RouteWaypoint({
    'name': 'SBBI',
    'type': 'ad',
    'adType': 'dep',
    'coord': {
      'degMinSec': "25°24'12''S 049°14'01''W",
      'decimal': {
        'lon': -49.23361111111111,
        'lat': -25.403333333333332,
      },
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': 3059.13878,
    'userEditedAltitude': 4500,
    'fixed': true,
    'alternate': false,
  }),
  Colombo: new RouteWaypoint({
    'name': 'Colombo',
    'type': 'coord',
    'coord': {
      'decimal': {
        'lat': -25.29943888888889,
        'lon': -49.224586111111115,
      },
      'degMinSec': "25°17'57.98''S 49°13'28.51''W",
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': null,
    'fixed': false,
    'alternate': false,
  }),
  SJOY: new RouteWaypoint({
    'name': 'SJOY',
    'type': 'ad',
    'adType': 'arr',
    'coord': {
      'degMinSec': "25°24'04''S 049°47'58''W",
      'decimal': {
        'lon': -49.79944444444444,
        'lat': -25.40111111111111,
      },
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': 3438.55362,
    'fixed': true,
    'alternate': false,
  }),
  SSCF: new RouteWaypoint({
    'name': 'SSCF',
    'type': 'ad',
    'adType': 'alt',
    'coord': {
      'degMinSec': "25°25'34''S 049°31'26''W",
      'decimal': {
        'lon': -49.52388888888889,
        'lat': -25.426111111111112,
      },
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': 3139.917,
    'fixed': true,
    'alternate': true,
  }),
  RioBranco: new RouteWaypoint({
    'name': 'Rio Branco do Sul',
    'type': 'coord',
    'coord': {
      'decimal': {
        'lat': -25.197111111111113,
        'lon': -49.31144722222222,
      },
      'degMinSec': "25°11'49.6''S 49°18'41.21''W",
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': null,
    'userEditedAltitude': 5500,
    'fixed': false,
    'alternate': false,
  }),
  CpoMagro: new RouteWaypoint({
    'name': 'Campo Magro',
    'type': 'coord',
    'coord': {
      'decimal': {
        'lat': -25.37393611111111,
        'lon': -49.449463888888886,
      },
      'degMinSec': "25°22'26.17''S 49°26'58.07''W",
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': null,
    'fixed': false,
    'alternate': false,
  }),
};

export const fullTestRoute = [
  new RouteWaypoint({
    'name': 'SBBI',
    'type': 'ad',
    'adType': 'dep',
    'coord': {
      'degMinSec': "25°24'12''S 049°14'01''W",
      'decimal': {
        'lon': -49.23361111111111,
        'lat': -25.403333333333332,
      },
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': 3059.13878,
    'userEditedAltitude': 4500,
    'fixed': true,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'Colombo',
    'type': 'coord',
    'coord': {
      'decimal': {
        'lat': -25.297575000000002,
        'lon': -49.22286944444445,
      },
      'degMinSec': "25°17'51.27''S 49°13'22.33''W",
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': null,
    'userEditedAltitude': 5500,
    'fixed': false,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'Rio Branco do Sul',
    'type': 'coord',
    'coord': {
      'decimal': {
        'lat': -25.199597222222224,
        'lon': -49.30938611111111,
      },
      'degMinSec': "25°11'58.55''S 49°18'33.79''W",
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': null,
    'userEditedAltitude': 5500,
    'fixed': false,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'Campo Magro',
    'type': 'coord',
    'coord': {
      'decimal': {
        'lat': -25.374866666666666,
        'lon': -49.449463888888886,
      },
      'degMinSec': "25°22'29.52''S 49°26'58.07''W",
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': null,
    'userEditedAltitude': 6500,
    'fixed': false,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'SJOY',
    'type': 'ad',
    'adType': 'arr',
    'coord': {
      'degMinSec': "25°24'04''S 049°47'58''W",
      'decimal': {
        'lon': -49.79944444444444,
        'lat': -25.40111111111111,
      },
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': 3438.55362,
    'fixed': true,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'SSCF',
    'type': 'ad',
    'adType': 'alt',
    'coord': {
      'degMinSec': "25°25'34''S 049°31'26''W",
      'decimal': {
        'lon': -49.52388888888889,
        'lat': -25.426111111111112,
      },
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': 3139.917,
    'fixed': true,
    'alternate': true,
  }),
];

export const fullTestRouteWithAlternateWaypoint = [
  new RouteWaypoint({
    'name': 'SBBI',
    'type': 'ad',
    'adType': 'dep',
    'coord': {
      'degMinSec': "25°24'12''S 049°14'01''W",
      'decimal': {
        'lon': -49.23361111111111,
        'lat': -25.403333333333332,
      },
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': 3059.13878,
    'userEditedAltitude': 4500,
    'fixed': true,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'Colombo',
    'type': 'coord',
    'coord': {
      'decimal': {
        'lat': -25.29695277777778,
        'lon': -49.2239,
      },
      'degMinSec': "25°17'49.03''S 49°13'26.04''W",
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': null,
    'userEditedAltitude': 5500,
    'fixed': false,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'Rio Branco do Sul',
    'type': 'coord',
    'coord': {
      'decimal': {
        'lat': -25.199597222222224,
        'lon': -49.31144722222222,
      },
      'degMinSec': "25°11'58.55''S 49°18'41.21''W",
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': null,
    'userEditedAltitude': 5500,
    'fixed': false,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'Campo Magro',
    'type': 'coord',
    'coord': {
      'decimal': {
        'lat': -25.374555555555556,
        'lon': -49.44911944444444,
      },
      'degMinSec': "25°22'28.4''S 49°26'56.83''W",
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': null,
    'userEditedAltitude': 6500,
    'fixed': false,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'SJOY',
    'type': 'ad',
    'adType': 'arr',
    'coord': {
      'degMinSec': "25°24'04''S 049°47'58''W",
      'decimal': {
        'lon': -49.79944444444444,
        'lat': -25.40111111111111,
      },
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': 3438.55362,
    'userEditedAltitude': 5500,
    'fixed': true,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'Campo Largo',
    'type': 'coord',
    'coord': {
      'decimal': {
        'lat': -25.478469444444443,
        'lon': -49.524994444444445,
      },
      'degMinSec': "25°28'42.49''S 49°31'29.98''W",
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': null,
    'userEditedAltitude': 4500,
    'fixed': false,
    'alternate': false,
  }),
  new RouteWaypoint({
    'name': 'SSCF',
    'type': 'ad',
    'adType': 'alt',
    'coord': {
      'degMinSec': "25°25'34''S 049°31'26''W",
      'decimal': {
        'lon': -49.52388888888889,
        'lat': -25.426111111111112,
      },
    },
    'ias': 61,
    'windSpeed': null,
    'windDirection': null,
    'altitude': 3139.917,
    'fixed': true,
    'alternate': true,
  }),
];

export const makeTestRoute = (wpts: (keyof typeof wayPoints)[]) => {
  if (new Set(wpts).size !== wpts.length) {
    throw new Error('Route cannot have duplicate waypoints');
  }
  return wpts.map((w) => wayPoints[w]);
};
