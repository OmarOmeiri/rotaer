import { degreeMinSecCoordsToDecimal } from '../converters/coordinates';
import { loxodromicBearing, loxodromicDistance, loxodromicMidPoint } from './routeUtils';

const DIST_UNIT = 'km' as const;
const MAX_DEV = {
  dist: 10,
  angle: 0.5,
};
const coords = [
  {
    1: '50 21 59N 004 08 02W',
    2: '42 21 04N 071 02 27W',
    expectedBearing: 260.1272222222222,
    expectedDist: 5198,
    expectedMidPoint: { lat: 46.35888888888889, lon: -38.81666666666667 },
  },
  {
    1: '50 21 59N 025 08 02E',
    2: '42 21 04N 071 02 27W',
    expectedBearing: 263.0963888888889,
    expectedDist: 7415,
    expectedMidPoint: { lat: 46.35888888888889, lon: -24.720833333333335 },
  },
  {
    1: '50 21 59N 025 08 02E',
    2: '42 21 04N 025 08 02E',
    expectedBearing: 180,
    expectedDist: 891.3,
    expectedMidPoint: { lat: 46.35888888888889, lon: 25.13388888888889 },
  },
  {
    1: '42 21 04N 004 08 02W',
    2: '50 21 59N 004 08 02W',
    expectedBearing: 0,
    expectedDist: 891.3,
    expectedMidPoint: { lat: 46.35888888888889, lon: 4.1338888888888885 },
  },
  {
    1: '50 21 59N 025 08 02E',
    2: '21 21 04S 025 08 02E',
    expectedBearing: 180,
    expectedDist: 7975,
    expectedMidPoint: { lat: 14.507777777777777, lon: 25.13388888888889 },
  },
  {
    1: '50 21 59N 025 08 02E',
    2: '21 21 04S 049 08 02W',
    expectedBearing: 222.74972222222223,
    expectedDist: 10860,
    expectedMidPoint: { lat: 14.507777777777777, lon: 15.367777777777778 },
  },
  {
    1: '50 21 59N 125 08 02W',
    2: '21 21 04S 049 08 02W',
    expectedBearing: 136.5913888888889,
    expectedDist: 10980,
    expectedMidPoint: { lat: 14.507777777777777, lon: 83.6875 },
  },
  {
    1: '50 21 59N 125 08 02W',
    2: '21 21 04S 048 08 02E',
    expectedBearing: 114.87694444444445,
    expectedDist: 18960,
    expectedMidPoint: { lat: 14.507777777777777, lon: 30.643055555555556 },
  },
  {
    1: '50 21 59N 125 08 02W',
    2: '21 21 04S 100 08 02E',
    expectedBearing: 239.19166666666666,
    expectedDist: 15570,
    expectedMidPoint: { lat: 14.507777777777777, lon: 161.39027777777778 },
  },
];

const checkDeviation = (num: number, ref: number, dev: number) => (
  Math.abs(num - ref) < dev
);
const isDistanceOk = (dist: number, coord: typeof coords[number]) => {
  if (Number.isNaN(Number(dist))) return false;
  if (checkDeviation(dist, coord.expectedDist, MAX_DEV.dist)) return true;
  return false;
};

const isBearingOk = (bearing: number, coord: typeof coords[number]) => {
  if (Number.isNaN(Number(bearing))) return false;
  if (checkDeviation(bearing, coord.expectedBearing, MAX_DEV.angle)) return true;
  return false;
};

const isMidPointOk = (midpoint: {lat: number, lon: number}, coord: typeof coords[number]) => {
  if (Number.isNaN(Number(midpoint.lat)) || Number.isNaN(Number(midpoint.lon))) return false;
  if (
    checkDeviation(midpoint.lat, coord.expectedMidPoint.lat, MAX_DEV.angle)
    || checkDeviation(midpoint.lon, coord.expectedMidPoint.lon, MAX_DEV.angle)
  ) return true;
  return false;
};

for (const coord of coords) {
  const pt1 = degreeMinSecCoordsToDecimal(coord[1]);
  const pt2 = degreeMinSecCoordsToDecimal(coord[2]);
  const dist = loxodromicDistance({
    lat1: pt1.lat,
    lon1: pt1.lon,
    lat2: pt2.lat,
    lon2: pt2.lon,
  }, DIST_UNIT);

  const bearing = loxodromicBearing({
    lat1: pt1.lat,
    lon1: pt1.lon,
    lat2: pt2.lat,
    lon2: pt2.lon,
  });

  const midPoint = loxodromicMidPoint({
    lat1: pt1.lat,
    lon1: pt1.lon,
    lat2: pt2.lat,
    lon2: pt2.lon,
  });

  if (
    isDistanceOk(dist, coord)
    && isBearingOk(bearing, coord)
    && isMidPointOk(midPoint, coord)
  ) {
    console.info(`[OK]: ${JSON.stringify({ distance: dist, bearing, midPoint }, null, 2)}`);
  } else {
    console.info(`[DISTANCE ${isDistanceOk(dist, coord) ? 'OK' : 'ERROR'}]: distance: ${dist}, expected: ${coord.expectedDist}`);
    console.info(`[BEARING ${isBearingOk(bearing, coord) ? 'OK' : 'ERROR'}]: bearing: ${bearing}, expected: ${coord.expectedBearing}`);
    console.info(`[MIDPOINT ${isMidPointOk(midPoint, coord) ? 'OK' : 'ERROR'}]: midpoint: ${JSON.stringify(midPoint)}, expected: ${JSON.stringify(coord.expectedMidPoint)}`);
  }

  console.info('#######');
}
