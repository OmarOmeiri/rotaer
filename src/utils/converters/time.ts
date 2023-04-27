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
      };
    },
  };
}());
