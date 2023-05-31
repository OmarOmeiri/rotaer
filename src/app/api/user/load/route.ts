import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import UserService from '../Service';
import { getCookie } from '../../utils/cookies';
import type { MyRequest } from '../../../../types/request';

type API = TAPI<'user', 'load'>;

@controller()
class LoadUserRoute implements API {
  async POST({ req }: MyRequest<undefined>) {
    const token = getCookie(req, 'x-auth-token');
    const service = new UserService();
    await service.withDb([MongoCollections.user]);
    const user = await service.load(token);
    return user;
  }
}

export const { POST } = new LoadUserRoute() as unknown as MyController<LoadUserRoute>;
