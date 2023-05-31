/* eslint-disable new-cap */
/* eslint-disable func-names */

import { ErrorCodes } from 'lullo-common-types';
import ServerError from '@/utils/Errors/ServerError';
import Translator from '../../../utils/Translate/Translator';
import type { MyRequest } from '../../../types/request';

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
      console.log('Protected', args.req.url);
      const userId = args.req.headers.get('user-id');
      if (!userId) throw getError();
      const result = await originalMethod(args);
      return result;
    };
  };
}
