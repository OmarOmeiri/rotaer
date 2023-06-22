import { TRequest } from '../../types/API';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';
import { WithErrorSuccessFetch } from '../types';

type CreateRoutes = TRequest<'user', 'create'>

export const createUser: WithErrorSuccessFetch<
CreateRoutes['POST']
> = async (args, options) => {
  const { data } = await new Api(API_ROUTES.user.create)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .body(args)
    .post<UserOmitPassword>();
  return data;
};
