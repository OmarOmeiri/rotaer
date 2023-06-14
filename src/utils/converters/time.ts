const readableHoursDecimal = (hours: number) => {
  const n = new Date(0, 0);
  n.setSeconds(hours * 60 * 60);
  return n.toTimeString().slice(0, 8);
};

export const TimeConverter = (function _() {
  const { floor } = Math;
  return {
    MS(value: number) {
      return {
        toS() {
          return floor(value / 1000);
        },
        toMin() {
          return floor(value / (60 * 1000));
        },
        toH() {
          return floor(value / (60 * 60 * 1000));
        },
        toD() {
          return floor(value / (60 * 60 * 24 * 1000));
        },
        tohhmmss() {
          return readableHoursDecimal(value / 3.6e+6);
        },
      };
    },
    S(value: number) {
      return {
        toMs() {
          return value * 1000;
        },
        toMin() {
          return floor(value / 60);
        },
        toH() {
          return floor(value / (60 * 60));
        },
        toD() {
          return floor(value / (60 * 60 * 24));
        },
        tohhmmss() {
          return readableHoursDecimal(value / 3600);
        },
      };
    },
    MIN(value: number) {
      return {
        toMs() {
          return value * 1000 * 60;
        },
        toS() {
          return value * 60;
        },
        toH() {
          return floor(value / 60);
        },
        toD() {
          return floor(value / (60 * 24));
        },
        tohhmmss() {
          return readableHoursDecimal(value / 60);
        },
      };
    },
    H(value: number) {
      return {
        toMs() {
          return value * 60 * 60 * 1000;
        },
        toS() {
          return value * 60 * 60;
        },
        toMin() {
          return value * 60;
        },
        toD() {
          return floor(value / 24);
        },
        tohhmmss() {
          return readableHoursDecimal(value);
        },
      };
    },
    D(value: number) {
      return {
        toMs() {
          return value * 60 * 60 * 1000 * 24;
        },
        toS() {
          return value * 60 * 60 * 24;
        },
        toMin() {
          return value * 60 * 24;
        },
        toH() {
          return value * 24;
        },
        tohhmmss() {
          return readableHoursDecimal(value * 24);
        },
      };
    },
    hhmmss(value: string) {
      const [h, m, s] = value.split(':').map(Number);
      return {
        toMs() {
          const _h = h * 60 * 60 * 1000;
          const _m = m * 1000 * 60;
          const _s = s * 1000;
          return _h + _m + _s;
        },
        toS() {
          const _h = h * 60 * 60;
          const _m = m * 60;
          return _h + _m + s;
        },
        toMin() {
          const _h = h * 60;
          const _s = s / 60;
          return _h + m + _s;
        },
        toH() {
          const _m = m / 60;
          const _s = s / (60 * 60);
          return h + _m + _s;
        },
        toD() {
          const _h = h / 24;
          const _m = m / (24 * 60);
          const _s = s / (24 * 60 * 60);
          return _h + _m + _s;
        },
      };
    },
  };
}());
