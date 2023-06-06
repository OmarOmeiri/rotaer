import { ObjectId } from 'mongodb';
import { omit } from 'lullo-utils/Objects';
import { ErrorCodes } from 'lullo-common-types';
import { zodPasswordValidator, zodUserNameValidator } from '../../../frameworks/zod/zodValidators';
import Translator from '../../../utils/Translate/Translator';
import BaseService from '../utils/BaseService';
import { MongoCollections } from '../../../types/app/mongo';
import { hashPassword } from '../../../utils/password/password';
import { getJWT, verifyJwt } from '../../../utils/jwt/jwt';
import { COMMON_API_ERRORS } from '../utils/Errors';
import ServerError from '../../../utils/Errors/ServerError';

const translator = new Translator({
  createUnsuccessful: { 'en-US': 'User creation failed', 'pt-BR': 'Houve um erro ao criar o usuário' },
});

const getError = (message: string, status: number) => (
  new ServerError(message, {
    status,
    code: ErrorCodes.authError,
  })
);

class UserService extends BaseService {
  async create({ username, password }: NativeAuthRequest) {
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
    if (user) {
      throw COMMON_API_ERRORS.userExists();
    }

    try {
      const newUser = await db.userDb.insertOne({
        username,
        password: await hashPassword(password),
      });
      const _id = newUser.insertedId.toString();
      return {
        _id,
        username,
      };
    } catch (err) {
      throw getError(translator.translate('createUnsuccessful'), 500);
    }
  }

  async load(token: string | null) {
    if (!token) {
      throw COMMON_API_ERRORS.expiredLogIn();
    }
    let userId: string;
    try {
      ({ userId } = verifyJwt(token));
    } catch (error) {
      throw COMMON_API_ERRORS.expiredLogIn();
    }

    const db = this.getDb([
      MongoCollections.user,
    ]);

    const user = await db.userDb.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw COMMON_API_ERRORS.usedDoesntExist();
    }
    return omit(user, 'password');
  }
}

export default UserService;
