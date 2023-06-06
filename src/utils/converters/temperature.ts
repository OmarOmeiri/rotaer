import { round } from 'lullo-utils/Math';

export const TemperatureConverter = (function _() {
  return {
    C(value: number) {
      return {
        toK() {
          return round(value + 273.15, 4);
        },
        toF() {
          return round((value * (9 / 5) + 32), 4);
        },
      };
    },
    K(value: number) {
      return {
        toC() {
          return round(value - 273.15, 4);
        },
        toF() {
          return round((value - 273.15) * (9 / 5) + 32, 4);
        },
      };
    },
    F(value: number) {
      return {
        toC() {
          return round((value - 32) * (5 / 9), 4);
        },
        toK() {
          return round((value - 32) * (5 / 9) + 273.15, 4);
        },
      };
    },
  };
}());
