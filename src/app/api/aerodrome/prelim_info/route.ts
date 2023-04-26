import coordinates from '@/data/preliminary_info.json';
import { controller } from '../../utils/controller';
import { TAerodromPrelimInfo } from '../../../../types/app/aerodrome';
import { TAPI } from '../../../../types/API';

type API = TAPI<'coordinates'>;

@controller()
class GetCoordinates implements API {
  async GET({ reqData }: MyRequest<{id: string} | undefined>) {
    const id = reqData?.id;
    if (!id) {
      return coordinates.reduce((arr, i) => {
        if (!i.coords) return arr;
        return [...arr, i];
      }, [] as TAerodromPrelimInfo[]);
    }
    const idLower = id
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    const coord = coordinates.find((a) => (
      a.icao
        .toLowerCase() === idLower
    ));
    return coord ? [coord] : [];
  }
}

export const { GET } = new GetCoordinates();
