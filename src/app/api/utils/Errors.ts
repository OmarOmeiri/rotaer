import { ErrorCodes } from 'lullo-common-types';
import ServerError from '../../../utils/Errors/ServerError';
import Translator from '../../../utils/Translate/Translator';

const translator = new Translator({
  unauthorized: { 'pt-BR': 'Não autorizado', 'en-US': 'Unauthorized' },
  userNotFound: { 'en-US': 'User not found', 'pt-BR': 'Usuário não encontrado' },
  acftNotFound: { 'en-US': 'Aircraft not found', 'pt-BR': 'Aeronave não encontrada' },
  invalidCredentials: { 'en-US': 'Invalid credentials', 'pt-BR': 'Credenciais inválidas' },
  userExists: { 'en-US': 'User already exists', 'pt-BR': 'Usuário já existe' },
  expiredLogin: { 'en-US': 'Login is expired', 'pt-BR': 'Login expirado' },
  usedDoesntExist: { 'en-US': 'User does not exist', 'pt-BR': 'Usuário não existente' },
});

export const COMMON_API_ERRORS = {
  unauthorized: () => (
    new ServerError(translator.translate('unauthorized'), {
      status: 401,
      code: ErrorCodes.authError,
    })
  ),
  userNotFound: () => (
    new ServerError(translator.translate('userNotFound'), {
      status: 404,
      code: ErrorCodes.userNotFound,
    })
  ),
  acftNotFound: () => (
    new ServerError(translator.translate('acftNotFound'), {
      status: 404,
      code: ErrorCodes.userNotFound,
    })
  ),
  invalidCredentials: () => (
    new ServerError(translator.translate('invalidCredentials'), {
      status: 401,
      code: ErrorCodes.apiUsageError,
    })
  ),
  userExists: () => (
    new ServerError(translator.translate('userExists'), {
      status: 401,
      code: ErrorCodes.apiUsageError,
    })
  ),
  expiredLogIn: () => (
    new ServerError(translator.translate('expiredLogin'), {
      status: 400,
      code: ErrorCodes.apiUsageError,
    })
  ),
  usedDoesntExist: () => (
    new ServerError(translator.translate('usedDoesntExist'), {
      status: 404,
      code: ErrorCodes.apiUsageError,
    })
  ),
};
