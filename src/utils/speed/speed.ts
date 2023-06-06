import { getAirDensity, getStandardAirTemp } from '../air/air';
import { toDegrees, toRadians } from '../angle/angles';
import { SpeedConverter } from '../converters/speed';
import { TemperatureConverter } from '../converters/temperature';

const P0 = 1.225; // ISA Air density at sea level (kg/m3)
const K = 1.4;// ratio of specific heat of air
const R = 287;// Specific gas constant for air

const getMachNumber = (speed: number, temp: number) => {
  const tempK = TemperatureConverter.C(temp).toK();
  const speedMs = SpeedConverter.kt(speed).toMs();
  const C = Math.sqrt(K * R * tempK);
  return speedMs / C;
};

const getWindCorrectionAngle = ({
  heading,
  windDirection,
  windSpeed,
  tas,
}:{
  heading: number,
  windSpeed: number,
  windDirection: number,
  tas: number,
}) => {
  const windAngle = toRadians(heading - (180 + windDirection));
  return toDegrees(Math.asin((windSpeed / tas) * Math.sin(windAngle)));
};

export const calcTAS = (altitude: number, ias: number) => {
  if (ias <= 260) {
    return (ias / Math.sqrt(getAirDensity(altitude) / P0));
  }
  const airTemp = getStandardAirTemp(altitude);
  const airTempK = TemperatureConverter.C(airTemp).toK();
  const mach = getMachNumber(ias, airTemp);
  return (
    39 * mach * Math.sqrt(airTempK)
  );
};

export const calcGS = ({
  heading,
  windDirection,
  windSpeed,
  tas,
}:{
  heading: number,
  windSpeed: number,
  windDirection: number,
  tas: number,
}) => {
  const corrAngle = getWindCorrectionAngle({
    heading,
    windDirection,
    windSpeed,
    tas,
  });

  return Math.sqrt(
    (tas ** 2)
    + (windSpeed ** 2)
    - (2 * tas * windSpeed * Math.cos(toRadians(heading - windDirection + corrAngle))),
  );
};

