export const SpeedConverter = (function _() {
  return {
    ms(value: number) {
      return {
        toKmh() {
          return value * 3.6;
        },
        toMph() {
          return value * 2.237;
        },
        toKt() {
          return value * 1.944;
        },
      };
    },
    kmh(value: number) {
      return {
        toMs() {
          return value / 3.6;
        },
        toMph() {
          return value / 1.609;
        },
        toKt() {
          return value / 1.852;
        },
      };
    },
    mph(value: number) {
      return {
        toMs() {
          return value / 2.237;
        },
        toKmh() {
          return value * 1.609;
        },
        toKt() {
          return value / 1.151;
        },
      };
    },
    kt(value: number) {
      return {
        toMs() {
          return value / 1.944;
        },
        toKmh() {
          return value * 1.852;
        },
        toKt() {
          return value * 1.151;
        },
      };
    },
  };
}());
