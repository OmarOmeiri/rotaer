import { UserOmitPassword } from '../../models/user/userModels';
import { TRequest } from '../../types/API';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';

type LogInRoutes = TRequest<'user', 'logIn'>
type LoadUserRoutes = TRequest<'user', 'load'>

export const googleLogIn: LogInRoutes['POST'] = async (args) => {
  const { data } = await new Api(API_ROUTES.aerodrome.find)
    .body(args)
    .post<IAuthResponse>();
  return data;
};

export const loadUser: LoadUserRoutes['POST'] = async () => {
  const { data } = await new Api(API_ROUTES.aerodrome.find)
    .post<UserOmitPassword>();
  return data;
};
