import aerodromeData from '@/data/aerodrome_data.json';
import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { TAerodromeData } from '../../../../types/app/aerodrome';

type API = TAPI<'info'>;

@controller()
class AerodromeInfo implements API {
  async GET({ reqData: { id } }: MyRequest<{id: string}>) {
    if (!id) return null;
    const idLower = id
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    const info = (aerodromeData as TAerodromeData[]).find((i) => (
      i.icao
        .toLowerCase()
        .startsWith(idLower)
      || i.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .includes(idLower)
    )) || null;
    return info;
  }
}

export const { GET } = new AerodromeInfo();
