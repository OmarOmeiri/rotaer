import aerodromeList from '@/data/aerodrome_list.json';
import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';

type API = TAPI<'find'>;

@controller()
class FindAerodrome implements API {
  async GET({ reqData: { id } }: MyRequest<{id: string}>) {
    if (!id) return [];
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
}

const cntrl = new FindAerodrome();
export const GET = cntrl.GET.bind(cntrl);
