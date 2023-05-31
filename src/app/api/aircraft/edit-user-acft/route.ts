import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections, WithStrId } from '../../../../types/app/mongo';
import AcftService from '../Service';
import { protectedRoute } from '../../utils/protectedRoute';
import type { MyRequest } from '../../../../types/request';

type API = TAPI<'acft', 'editUserAcft'>;

@controller()
class EditAircraft implements API {
  @protectedRoute()
  async PATCH({ reqData }: MyRequest<WithStrId<IUserAcft>>) {
    const service = new AcftService();
    await (await service.withDb([
      MongoCollections.userAcft,
    ]))
      .patch(reqData);
    return null;
  }
}

export const { PATCH } = new EditAircraft() as unknown as MyController<EditAircraft>;
