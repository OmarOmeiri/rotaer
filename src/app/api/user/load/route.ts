import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import UserService from '../Service';

type API = TAPI<'user', 'load'>;

@controller()
class LoadUserRoute implements API {
  async POST({ req: { headers } }: MyRequest<undefined>) {
    const token = headers.get('x-auth-token');
    const service = new UserService();
    await service.withDb([MongoCollections.user]);
    const user = await service.load(token);
    return user;
  }
}

export const { POST } = new LoadUserRoute() as unknown as MyController<LoadUserRoute>;
