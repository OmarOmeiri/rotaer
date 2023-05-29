import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import AerodromeService from '../Service';

type API = TAPI<'aerodrome', 'coordinates'>;

@controller()
class GetCoordinates implements API {
  async GET({ reqData }: MyRequest<{id: string} | undefined>) {
    const id = reqData?.id;

    const service = new AerodromeService();
    return service.getAerodromePrelimInfo(id);
  }
}

export const { GET } = new GetCoordinates() as unknown as MyController<GetCoordinates>;
