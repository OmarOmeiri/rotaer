import { zodPasswordValidator, zodUserNameValidator } from '../../../frameworks/zod/zodValidators';
import { MongoCollections } from '../../../types/app/mongo';
import BaseService from '../utils/BaseService';
import { comparePassword } from '../../../utils/password/password';
import { getJWT } from '../../../utils/jwt/jwt';
import { COMMON_API_ERRORS } from '../utils/Errors';

class AuthService extends BaseService {
  async authenticate({ username, password }: NativeAuthRequest) {
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
    if (await (comparePassword(password, user.password))) {
      const id = user._id.toString();
      const token = getJWT(id);
      return {
        token,
        msg: `Bem vindo, ${user.username.split('@')[0]}`,
        id,
      };
    }

    throw COMMON_API_ERRORS.invalidCredentials();
  }

  async gAuth(username: string) {
    const db = this.getDb([
      MongoCollections.user,
    ]);

    const user = await db.userDb.findOne({ username });
    if (!user) {
      const newUser = await db.userDb.insertOne({ username });
      const userId = newUser.insertedId.toString();
      const token = getJWT(userId);
      return {
        token,
        msg: `Bem vindo, ${username.split('@')[0]}`,
        id: userId,
      };
    }

    const userId = user._id.toString();
    const token = getJWT(userId);
    return {
      token,
      msg: `Bem vindo, ${user.username.split('@')[0]}`,
      id: userId,
    };
  }
}
export default AuthService;
