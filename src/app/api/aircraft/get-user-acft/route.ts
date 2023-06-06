import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import AcftService from '../Service';
import { protectedRoute } from '../../utils/protectedRoute';
import type { MyRequest } from '../../../../types/request';

type API = TAPI<'acft', 'findUserAcft'>;

@controller()
class FindAircraft implements API {
  @protectedRoute()
  async GET({ reqData: { userId } }: MyRequest<{userId: string}>) {
    const service = new AcftService();

    const acfts = await (await service.withDb([
      MongoCollections.user,
      MongoCollections.userAcft,
    ]))
      .findUserAcft(userId);
    return acfts;
  }
}

const cntrl = new FindAircraft() as unknown as MyController<FindAircraft>;
export const { GET } = cntrl;
