import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import AuthService from '../Service';
import type { MyRequest } from '../../../../types/request';

type API = TAPI<'auth', 'authenticate'>;

@controller()
class Authenticate implements API {
  async POST({ reqData: { username, password }, res }: MyRequest<NativeAuthRequest>) {
    const service = new AuthService();
    await service.withDb([MongoCollections.user]);
    const auth = await service.authenticate({ username, password });
    res.cookies.set('x-auth-token', auth.token, { expires: auth.expiresAt });
    return auth;
  }
}

export const { POST } = new Authenticate() as unknown as MyController<Authenticate>;
