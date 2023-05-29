import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import AcftService from '../Service';
import { protectedRoute } from '../../utils/protectedRoute';
import { COMMON_API_ERRORS } from '../../utils/Errors';

type API = TAPI<'acft', 'deleteUserAcft'>;

@controller()
class DeleteAircraft implements API {
  @protectedRoute()
  async DELETE({ reqData: { acftId }, req }: MyRequest<{acftId: string}>) {
    const userId = req.headers.get('user-id');
    if (!userId) {
      throw COMMON_API_ERRORS.unauthorized();
    }
    const service = new AcftService();
    await (await service.withDb([
      MongoCollections.user,
      MongoCollections.userAcft,
    ]))
      .delete(userId, acftId);
    return null;
  }
}

export const { DELETE } = new DeleteAircraft() as unknown as MyController<DeleteAircraft>;
