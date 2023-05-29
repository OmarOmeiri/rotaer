/* eslint-disable new-cap */
/* eslint-disable func-names */

import { ErrorCodes } from 'lullo-common-types';
import ServerError from '@/utils/Errors/ServerError';
import Translator from '../../../utils/Translate/Translator';
import { verifyJwt } from '../../../utils/jwt/jwt';

const translator = new Translator({
  unauthorized: { 'pt-BR': 'Não autorizado', 'en-US': 'Unauthorized' },
});

const getError = () => new ServerError(translator.translate('unauthorized'), {
  status: 401,
  code: ErrorCodes.authError,
});

/** */
export function protectedRoute() {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (args: MyRequest<any>) {
      const token = args.req.headers.get('x-auth-token');
      if (!token) {
        throw getError();
      }
      try {
        const { userId } = verifyJwt(token);
        args.req.headers.set('user-id', userId);
      } catch {
        throw getError();
      }
      const result = await originalMethod(args);
      return result;
    };
  };
}
