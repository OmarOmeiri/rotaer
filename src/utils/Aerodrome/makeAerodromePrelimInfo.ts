import { TAerodromPrelimInfo, TAerodromeData } from '../../types/app/aerodrome';

export const makeAerodromePrelimInfo = (info: PartialRequired<TAerodromeData, 'coords', true>): TAerodromPrelimInfo => ({
  icao: info.icao,
  name: info.name,
  coords: info.coords,
  type: info.type,
  city: info.city,
  uf: info.uf,
  elev: info.elev,
});
