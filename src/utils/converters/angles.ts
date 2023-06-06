const LATLON_RE = {
  full: /^(?<deg>\d{1,3})°(?<min>\d{1,2})'(?<sec>\d{1,2}\.?\d*\s?)$/i,
  spaced: /^(?<deg>\d{1,3})\s(?<min>\d{1,2})\s(?<sec>\d{1,2}\.?\d*\s?)/,
};

const isValidNumber = (value: unknown): value is number => {
  const num = Number(value);
  if (Number.isNaN(num)) return false;
  return true;
};

const parseLatLong = (coord: string) => {
  let result: RegExpExecArray | null = null;
  for (const re of Object.values(LATLON_RE)) {
    const ex = re.exec(coord);
    if (ex) {
      result = ex;
      break;
    }
  }

  if (result && result.groups) {
    const groups = Object.fromEntries(
      Object.entries(result.groups)
        .map(([k, v]) => [k, Number(v)]),
    );
    const { deg, min, sec } = groups;
    if (
      isValidNumber(deg)
      && isValidNumber(min)
      && isValidNumber(sec)
    ) return { deg, min, sec };
  }
  throw new Error(`Invalid coordinate: ${coord}`);
};

export const AngleConverter = (function _() {
  return {
    degMinSec(value: string) {
      return {
        toDecimal() {
          const { deg, min, sec } = parseLatLong(value);
          const _min = min + (sec / 60);
          return deg + (_min / 60);
        },
      };
    },
    decimal(value: number) {
      return {
        toDegMinSec() {
          const deg = Math.trunc(value);
          const min = (value - deg) * 60;
          const minInt = Math.trunc(min);
          const sec = (min - minInt) * 60;

          return `${deg}°${minInt}'${sec.toFixed(2)}''`;
        },
      };
    },
  };
}());

