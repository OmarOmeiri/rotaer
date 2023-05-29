import { TRequest } from '../../types/API';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';

type GLogInRoutes = TRequest<'auth', 'gAuth'>
type AuthRoutes = TRequest<'auth', 'authenticate'>

export const authenticate: AuthRoutes['POST'] = async (args) => {
  const { data } = await new Api(API_ROUTES.auth.authenticate)
    .body(args)
    .post<IAuthResponse>();
  return data;
};

export const googleLogIn: GLogInRoutes['POST'] = async (args) => {
  const { data } = await new Api(API_ROUTES.auth.gauth)
    .body(args)
    .post<IAuthResponse>();
  return data;
};

