import { LengthConverter } from '../converters/length';
import { TemperatureConverter } from '../converters/temperature';

const P0 = 101325; // sea level standard atmospheric pressure (Pa)
const T0 = 288.15; // sea level standard temperature (K)
const G = 9.80665;// Earth-surface gravitational acceleration  m/s2.
const L = -0.0065;// temperature lapse rate (K/m)
const R = 8.31447;// universal gas constant (J/(mol·K))
const M = 0.0289644;// molar mass of dry air (kg/mol)

export const getAirDensity = (altitude: number) => {
  const altitudeMeters = LengthConverter.ft(altitude).toM();
  const T = T0 + (L * altitudeMeters);
  const p = P0 * ((1 + ((L * altitudeMeters) / T0)) ** ((G * M) / (R * L * -1)));
  return ((p * M) / (R * T));
};

export const getStandardAirTemp = (altitude: number) => {
  const altitudeMeters = LengthConverter.ft(altitude).toM();
  return TemperatureConverter.K(T0 + (L * altitudeMeters)).toC();
};

