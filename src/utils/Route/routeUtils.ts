/**
 * Reference
 * http://www.movable-type.co.uk/scripts/latlong.html
 */
import { toDegrees, toRadians } from '../angle/angles';
import { LengthConverter } from '../converters/length';
import type { RouteAcftData } from './Route';

const EARTH_RADIUS = 6371;

type TwoPoint = {
  lat1: number, lon1: number, lat2: number, lon2: number
}

type DistanceUnits =
'm'
| 'km'
| 'nm'

const getΔ = (coord1: number, coord2: number) => Math.max(coord1, coord2) - Math.min(coord1, coord2);

export const loxodromicDistance = ({
  lat1,
  lon1,
  lat2,
  lon2,
}:TwoPoint, unit: DistanceUnits): number => {
  const lat1R = toRadians(lat1);
  const lat2R = toRadians(lat2);

  const Δlat = toRadians(getΔ(lat1, lat2));
  let Δλ = toRadians(getΔ(lon1, lon2));
  const Δψ = Math.log(Math.tan(Math.PI / 4 + lat2R / 2) / Math.tan(Math.PI / 4 + lat1R / 2));
  const q = Math.abs(Δψ) > 10e-12 ? Δlat / Δψ : Math.cos(lat1R);

  // if dLon over 180° take shorter rhumb line across the anti-meridian:
  if (Math.abs(Δλ) > Math.PI) Δλ = Δλ > 0 ? -(2 * Math.PI - Δλ) : (2 * Math.PI + Δλ);

  const distKm = Math.sqrt(Δlat * Δlat + q * q * Δλ * Δλ) * EARTH_RADIUS;
  if (unit === 'm') return distKm * 1000;
  if (unit === 'nm') return LengthConverter.Km(distKm).toNm();
  return distKm;
};

export const loxodromicBearing = ({
  lat1,
  lon1,
  lat2,
  lon2,
}:TwoPoint): number => {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const λ1 = toRadians(lon1);
  const λ2 = toRadians(lon2);
  let Δλ = λ2 - λ1;
  const Δψ = Math.log(Math.tan(Math.PI / 4 + φ2 / 2) / Math.tan(Math.PI / 4 + φ1 / 2));

  // if dLon over 180° take shorter rhumb line across the anti-meridian:
  if (Math.abs(Δλ) > Math.PI) Δλ = Δλ > 0 ? -(2 * Math.PI - Δλ) : (2 * Math.PI + Δλ);

  const brg = toDegrees(Math.atan2(Δλ, Δψ));
  if (brg < 0) return 360 + brg;
  return brg;
};

export const loxodromicMidPoint = ({
  lat1,
  lon1,
  lat2,
  lon2,
}:TwoPoint): {lat: number, lon: number} => {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  let λ1 = toRadians(lon1);
  const λ2 = toRadians(lon2);
  if (Math.abs(λ2 - λ1) > Math.PI) λ1 += 2 * Math.PI; // crossing anti-meridian

  const φ3 = (φ1 + φ2) / 2;
  const f1 = Math.tan(Math.PI / 4 + φ1 / 2);
  const f2 = Math.tan(Math.PI / 4 + φ2 / 2);
  const f3 = Math.tan(Math.PI / 4 + φ3 / 2);
  let λ3 = ((λ2 - λ1) * Math.log(f3) + λ1 * Math.log(f2) - λ2 * Math.log(f1)) / Math.log(f2 / f1);

  if (!Number.isFinite(λ3)) λ3 = (λ1 + λ2) / 2; // parallel of latitude
  return { lat: toDegrees(φ3), lon: toDegrees(λ3) };
};

export const getRouteAltitudeChangeTime = (
  altitude1: number,
  altitude2: number,
  acft: RouteAcftData,
) => {
  if (
    !acft.climbRate
    || !acft.descentRate
  ) return NaN;
  let isClimb = true;

  const altitudeChange = altitude2 - altitude1;
  if (altitudeChange === 0) return 0;
  if (altitudeChange < 0) isClimb = false;
  const altitudeChangeTime = (
    isClimb
      ? Math.abs(altitudeChange) / Math.abs(acft.climbRate)
      : Math.abs(altitudeChange) / Math.abs(acft.descentRate)
  ) / 60;
  return altitudeChangeTime;
};

export const getRouteAltitudeChangeDistance = (
  time: number,
  gs: number,
) => time * gs;
