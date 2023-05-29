import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import { protectedRoute } from '../../utils/protectedRoute';
import AcftService from '../Service';
import { COMMON_API_ERRORS } from '../../utils/Errors';

type API = TAPI<'acft', 'find'>;

@controller()
class SaveAircraft implements API {
  @protectedRoute()
  async GET({ reqData: { id }, req }: MyRequest<{id: string}>) {
    const userId = req.headers.get('user-id');
    if (!userId) {
      throw COMMON_API_ERRORS.unauthorized();
    }
    const service = new AcftService();
    await service.withDb([
      MongoCollections.user,
      MongoCollections.acft,
      MongoCollections.userAcft,
    ]);
    await service.save(userId, id);
    return null;
  }
}

export const { GET } = new SaveAircraft() as unknown as MyController<SaveAircraft>;
