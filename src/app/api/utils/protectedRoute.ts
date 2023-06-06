/* eslint-disable new-cap */
/* eslint-disable func-names */

import { ErrorCodes } from 'lullo-common-types';
import { getServerSession } from 'next-auth';
import ServerError from '@/utils/Errors/ServerError';
import Translator from '../../../utils/Translate/Translator';
import type { MyRequest } from '../../../types/request';
import { authOptions } from '../auth/[...nextauth]/route';

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
      const session = await getServerSession(authOptions);
      if (!session || !session.user?._id) throw getError();
      args.req.headers.set('user-id', session.user._id);
      const result = await originalMethod(args);
      return result;
    };
  };
}
