export const LengthConverter = (function _() {
  return {
    mm(value: number) {
      return {
        toCm() {
          return value / 10;
        },
        toFt() {
          return value / 304.8;
        },
        toM() {
          return value / 1000;
        },
        toKm() {
          return value / 1e6;
        },
        toMi() {
          return value / 1.609e+6;
        },
        toNm() {
          return value / 1.852e+6;
        },
      };
    },
    cm(value: number) {
      return {
        toMm() {
          return value * 10;
        },
        toFt() {
          return value / 30.48;
        },
        toM() {
          return value / 100;
        },
        toKm() {
          return value / 1e5;
        },
        toMi() {
          return value / 160900;
        },
        toNm() {
          return value / 185200;
        },
      };
    },
    ft(value: number) {
      return {
        toMm() {
          return value * 304.8;
        },
        toCm() {
          return value / 30.48;
        },
        toM() {
          return value / 3.281;
        },
        toKm() {
          return value / 3281;
        },
        toMi() {
          return value / 5280;
        },
        toNm() {
          return value / 6076;
        },
      };
    },
    M(value: number) {
      return {
        toMm() {
          return value * 1e3;
        },
        toCm() {
          return value * 100;
        },
        toFt() {
          return value * 3.281;
        },
        toKm() {
          return value / 1e3;
        },
        toMi() {
          return value / 1609;
        },
        toNm() {
          return value / 1852;
        },
      };
    },
    Km(value: number) {
      return {
        toMm() {
          return value * 1e6;
        },
        toCm() {
          return value * 1e5;
        },
        toFt() {
          return value * 3281;
        },
        toM() {
          return value * 1e3;
        },
        toMi() {
          return value / 1.609;
        },
        toNm() {
          return value / 1.852;
        },
      };
    },
    Mi(value: number) {
      return {
        toMm() {
          return value * 1.609e+6;
        },
        toCm() {
          return value * 160900;
        },
        toFt() {
          return value * 5280;
        },
        toM() {
          return value * 1609;
        },
        toKm() {
          return value * 1.609;
        },
        toNm() {
          return value / 1.151;
        },
      };
    },
    Nm(value: number) {
      return {
        toMm() {
          return value * 1.852e+6;
        },
        toCm() {
          return value * 185200;
        },
        toFt() {
          return value * 6076;
        },
        toM() {
          return value * 1852;
        },
        toKm() {
          return value * 1.852;
        },
        toMi() {
          return value * 1.151;
        },
      };
    },
  };
}());
