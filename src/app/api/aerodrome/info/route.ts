import MongoDb from '@mongo';
import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { TAerodromeData } from '../../../../types/app/aerodrome';
import { MongoCollections } from '../../../../types/app/mongo';

type API = TAPI<'info'>;

@controller()
class AerodromeInfo implements API {
  async GET({ reqData: { id } }: MyRequest<{id: string}>) {
    if (!id) return null;
    const db = await MongoDb([
      MongoCollections.aerodrome,
      MongoCollections.coord,
      MongoCollections.rwy,
    ]);

    const idLower = id
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

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
}

export const { GET } = new AerodromeInfo();
