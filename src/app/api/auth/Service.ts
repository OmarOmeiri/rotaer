import { omit } from 'lullo-utils/Objects';
import { zodEmailValidator, zodPasswordValidator, zodUserNameValidator } from '../../../frameworks/zod/zodValidators';
import { MongoCollections } from '../../../types/app/mongo';
import BaseService from '../utils/BaseService';
import { comparePassword } from '../../../utils/password/password';
import { COMMON_API_ERRORS } from '../utils/Errors';

class AuthService extends BaseService {
  async authenticate({ username, password }: Partial<NativeAuthRequest>) {
    try {
      zodUserNameValidator(username);
      zodPasswordValidator(password);
    } catch (error) {
      throw COMMON_API_ERRORS.invalidCredentials();
    }

    const db = this.getDb([
      MongoCollections.user,
    ]);

    const user = await db.userDb.findOne({ username });
    if (!user) {
      throw COMMON_API_ERRORS.invalidCredentials();
    }
    if (!user.password) {
      throw COMMON_API_ERRORS.invalidCredentials();
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (await (comparePassword(password!, user.password))) {
      return user;
    }

    throw COMMON_API_ERRORS.invalidCredentials();
  }

  async gAuth(username?: string) {
    try {
      zodEmailValidator(username);
    } catch (error) {
      throw COMMON_API_ERRORS.invalidCredentials();
    }

    const db = this.getDb([
      MongoCollections.user,
    ]);

    const user = await db.userDb.findOne({ username });
    if (!user) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const newUser = await db.userDb.insertOne({ username: username! });
      const _id = newUser.insertedId.toString();
      return {
        _id,
        username,
      };
    }

    return omit(user, 'password', 'acfts');
  }
}
export default AuthService;
