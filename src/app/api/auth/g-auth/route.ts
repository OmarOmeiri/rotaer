import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import AuthService from '../Service';

type API = TAPI<'auth', 'gAuth'>;

@controller()
class Authenticate implements API {
  async POST({ reqData: { username } }: MyRequest<GoogleAuthRequest>) {
    const service = new AuthService();
    await service.withDb([MongoCollections.user]);
    const auth = await service.gAuth(username);
    return auth;
  }
}

export const { POST } = new Authenticate() as unknown as MyController<Authenticate>;
