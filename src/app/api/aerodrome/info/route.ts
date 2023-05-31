import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import AerodromeService from '../Service';
import { MongoCollections } from '../../../../types/app/mongo';
import type { MyRequest } from '../../../../types/request';

type API = TAPI<'aerodrome', 'info'>;

@controller()
class AerodromeInfo implements API {
  async GET({ reqData: { id } }: MyRequest<{id: string}>) {
    if (!id) return null;
    const service = new AerodromeService();
    await service.withDb([
      MongoCollections.aerodrome,
      MongoCollections.coord,
      MongoCollections.rwy,
    ]);
    const info = await service.getAerodromeInfo(id);
    return info;
  }
}

export const { GET } = new AerodromeInfo() as unknown as MyController<AerodromeInfo>;
