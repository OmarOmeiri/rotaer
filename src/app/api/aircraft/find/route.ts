import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections, WithStrId } from '../../../../types/app/mongo';
import AcftService from '../Service';
import type { MyRequest } from '../../../../types/request';

type API = TAPI<'acft', 'find'>;

@controller()
class FindAircraft implements API {
  async GET({ reqData: { id } }: MyRequest<{id: string}>) {
    const service = new AcftService();
    const acft = await (await service.withDb([MongoCollections.acft]))
      .find(id);
    return acft as WithStrId<IAcft> | null;
  }
}

const cntrl = new FindAircraft() as unknown as MyController<FindAircraft>;
export const { GET } = cntrl;
