import { TRequest } from '../../types/API';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';

type CreateRoutes = TRequest<'user', 'create'>
type LoadUserRoutes = TRequest<'user', 'load'>

export const createUser: CreateRoutes['POST'] = async (args) => {
  const { data } = await new Api(API_ROUTES.user.create)
    .body(args)
    .post<IAuthResponse>();
  return data;
};

export const loadUser: LoadUserRoutes['POST'] = async () => {
  const { data } = await new Api(API_ROUTES.user.load)
    .post<UserOmitPassword>();
  return data;
};
