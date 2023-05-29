import ADPrelimInfo from '@/data/preliminary_info.json';
import aerodromeList from '@/data/aerodrome_list.json';
import { MongoCollections } from '../../../types/app/mongo';
import { TAerodromPrelimInfo, TAerodromeData } from '../../../types/app/aerodrome';
import BaseService from '../utils/BaseService';

class AerodromeService extends BaseService {
  find(id: string) {
    const idLower = id
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    const aerodromes = aerodromeList.filter((a) => (
      a.icao
        .toLowerCase()
        .startsWith(idLower)
      || a.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .includes(idLower)
    )).slice(0, 10)
      .sort((a, b) => (
        a.name.localeCompare(b.name)
      ));
    return aerodromes;
  }

  async getAerodromeInfo(id: string) {
    const idLower = id
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
    const db = this.getDb([
      MongoCollections.aerodrome,
      MongoCollections.coord,
      MongoCollections.rwy,
    ]);

    const aerodrome = await db.aerodromeDb.findOne({
      icao: new RegExp(`^${idLower}`, 'i'),
    });
    if (!aerodrome) return null;
    const runways = await db.runwayDb.find({ _id: { $in: aerodrome.rwys } }).toArray();
    const coordinates = await db.aerodromeCoordsDb.findOne({ _id: aerodrome.coords });

    const info: TAerodromeData = {
      ...aerodrome,
      rwys: runways,
      coords: coordinates
        ? {
          degMinSec: coordinates?.deg,
          decimal: { lon: coordinates?.decim[0], lat: coordinates?.decim[1] },
        }
        : null,
    };
    return info;
  }

  getAerodromePrelimInfo(id?: string) {
    if (!id) {
      return ADPrelimInfo.reduce((arr, i) => {
        if (!i.coords) return arr;
        return [...arr, i];
      }, [] as TAerodromPrelimInfo[]);
    }
    const idLower = id
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    const coord = ADPrelimInfo.find((a) => (
      a.icao
        .toLowerCase() === idLower
    ));
    return coord ? [coord] : [];
  }
}

export default AerodromeService;
