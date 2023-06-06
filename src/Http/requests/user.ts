import { TRequest } from '../../types/API';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';

type CreateRoutes = TRequest<'user', 'create'>

export const createUser: CreateRoutes['POST'] = async (args) => {
  const { data } = await new Api(API_ROUTES.user.create)
    .body(args)
    .post<UserOmitPassword>();
  return data;
};
