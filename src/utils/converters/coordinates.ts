const LATLON_RE = /^(?<deg>\d{1,3})°(?<min>\d{1,2})'(?<sec>\d{1,2}\.?\d*\s?)''(?<hemisphere>[S|N|W|E]+)$/i;

const parseLatLong = (coord: string) => {
  const result = LATLON_RE.exec(coord);
  if (result && result.groups) {
    return result.groups;
  }
  throw new Error(`Invalid coordinate: ${coord}`);
};

const _degreeMinSecToDecimal = (deg: number, min: number, sec: number, hemisphere: string) => (
  (deg + (min / 60) + (sec / 3600)) * (/[S|W]/.test(hemisphere) ? -1 : 1)
);

export const degreeMinSecToDecimal = (coord: string) => {
  const [lat, lon] = coord.split(' ');
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
