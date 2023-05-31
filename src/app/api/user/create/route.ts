import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import UserService from '../Service';
import type { MyRequest } from '../../../../types/request';

type API = TAPI<'user', 'create'>;

@controller()
class CreateUser implements API {
  async POST({ reqData: { username, password } }: MyRequest<NativeAuthRequest>) {
    const service = new UserService();
    await service.withDb([MongoCollections.user]);
    const user = await service.create({ username, password });
    return user;
  }
}

export const { POST } = new CreateUser() as unknown as MyController<CreateUser>;
