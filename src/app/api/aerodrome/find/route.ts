import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import AerodromeService from '../Service';

type API = TAPI<'aerodrome', 'find'>;

@controller()
class FindAerodrome implements API {
  async GET({ reqData: { id } }: MyRequest<{id: string}>) {
    if (!id) return [];
    const service = new AerodromeService();
    return service.find(id);
  }
}

export const { GET } = new FindAerodrome() as unknown as MyController<FindAerodrome>;

