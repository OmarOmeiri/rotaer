import { round } from 'lullo-utils/Math';

const LATLON_RE = {
  fullWithHemisphere: /^(?<deg>\d{1,3})°\s*(?<min>\d{1,2})'\s*(?<sec>\d{1,2}\.?\d*\s?)(''|")(?<hemisphere>[S|N|W|E]+)$/i,
  fullWithoutHemisphere: /^(?<deg>-?\d{1,3})°\s*(?<min>\d{1,2})'\s*(?<sec>\d{1,2}\.?\d*\s?)(''|")$/i,
  spaced: /^(?<deg>\d{1,3})\s(?<min>\d{1,2})\s(?<sec>\d{1,2}\.?\d*\s?)\s?(?<hemisphere>[S|N|W|E]+)/,
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
    return result.groups;
  }
  throw new Error(`Invalid coordinate: ${coord}`);
};

const _degreeMinSecToDecimal = (deg: number, min: number, sec: number, hemisphere: string | undefined) => {
  let factor = 1;
  if (/[S|W]/.test(hemisphere || '')) factor = -1;
  else if (deg < 0) factor = -1;
  return ((
    Math.abs(deg)
    + (min / 60)
    + (sec / 3600)
  ) * factor);
};

export const degreeMinSecCoordsToDecimal = (coord: string) => {
  const splitIndex = /(S|N|W|E])/i.test(coord)
    ? coord.split('').findIndex((char) => /^(S|N|W|E])$/.test(char))
    : /(''|")/.exec(coord)?.index || -1;
  if (splitIndex < 0) throw new Error(`Invalid coordinate: ${coord}`);

  const splitOffset = coord[splitIndex] === "'" && coord[splitIndex + 1] === "'"
    ? 2
    : 1;

  const [lat, lon] = [
    coord.slice(0, splitIndex + splitOffset).trim(),
    coord.slice(splitIndex + splitOffset, coord.length).trim(),
  ];
  const parsedLat = parseLatLong(lat);
  const parsedLon = parseLatLong(lon);

  const {
    deg: latDeg,
    min: latMin,
    sec: latSec,
    hemisphere: latHemisphere,
  } = parsedLat;
  const {
    deg: lonDeg,
    min: lonMin,
    sec: lonSec,
    hemisphere: lonHemisphere,
  } = parsedLon;
  return {
    lat: _degreeMinSecToDecimal(Number(latDeg), Number(latMin), Number(latSec), latHemisphere),
    lon: _degreeMinSecToDecimal(Number(lonDeg), Number(lonMin), Number(lonSec), lonHemisphere),
  };
};

const LON_DECIM_RE = /^-?([0-9]|[1-9][0-9]|1[0-7][0-9]|180)(\.\d+)?$/;
const LAT_DECIM_RE = /^-?([0-9]|[1-8][0-9]|90)(\.\d+)?$/;
export const convertUnknownCoordinatesToDecimal = (value: string) => {
  const [c1, c2] = value.split(',').map((c) => c.trim());
  let lat: number | undefined;
  let lon: number | undefined;

  if (LAT_DECIM_RE.test(c1)) lat = Number(c1);
  if (LON_DECIM_RE.test(c2)) lon = Number(c2);
  if (typeof lat === 'number' && typeof lon === 'number') return { lat, lon };

  return degreeMinSecCoordsToDecimal(value);
};

const _decimalCoordinatesToDegMinSec = (coord: number) => {
  const deg = Math.trunc(coord);
  const _min = (Math.abs(coord) - Math.abs(deg)) * 60;
  const min = Math.trunc(_min);
  const sec = round((_min - min) * 60, 2);

  return `${deg}°${min}'${sec}''`;
};

export const decimalCoordinatesToDegMinSec = (coord: {lat: number, lon: number}) => {
  let latDeg = _decimalCoordinatesToDegMinSec(coord.lat);
  let lonDeg = _decimalCoordinatesToDegMinSec(coord.lon);
  if (/^-/.test(latDeg)) {
    latDeg = `${latDeg.replace(/^-/, '')}S`;
  } else {
    latDeg = `${latDeg}N`;
  }

  if (/^-/.test(lonDeg)) {
    lonDeg = `${lonDeg.replace(/^-/, '')}W`;
  } else {
    lonDeg = `${lonDeg}E`;
  }
  return `${latDeg} ${lonDeg}`;
};
