export const PressureConverter = (function _() {
  return {
    inHg(value: number) {
      return {
        toPa() {
          return value * 3386.39;
        },
        tohPa() {
          return value * 33.8639;
        },
        toPsi() {
          return value / 2.036;
        },
        toAtm() {
          return value / 29.921;
        },
        toBar() {
          return value / 29.53;
        },
      };
    },
    bar(value: number) {
      return {
        toInHg() {
          return value * 29.53;
        },
        toPa() {
          return value * 1e5;
        },
        tohPa() {
          return value * 1e3;
        },
        toPsi() {
          return value * 14.5038;
        },
        toAtm() {
          return value * 0.986923;
        },
      };
    },
    Pa(value: number) {
      return {
        toInHg() {
          return value / 3386;
        },
        toBar() {
          return value / 1e5;
        },
        tohPa() {
          return value / 1e2;
        },
        toPsi() {
          return value / 6895;
        },
        toAtm() {
          return value / 101300;
        },
      };
    },
    hPa(value: number) {
      return {
        toInHg() {
          return value / 0.029529;
        },
        toPa() {
          return value * 100;
        },
        toBar() {
          return value / 1e3;
        },
        toPsi() {
          return value * 0.0145;
        },
        toAtm() {
          return value / 1013.25;
        },
      };
    },
    atm(value: number) {
      return {
        toInHg() {
          return value * 29.921;
        },
        toPa() {
          return value * 101325;
        },
        tohPa() {
          return value * 1013.25;
        },
        toBar() {
          return value * 1.01325;
        },
        toPsi() {
          return value * 14.6959;
        },
      };
    },
  };
}());
