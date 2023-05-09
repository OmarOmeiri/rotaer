import { TRequest } from '../../types/API';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';

type AcftRoutes = TRequest<'acft', 'find'>

export const findAircraft: AcftRoutes['GET'] = async (args) => {
  const { data } = await new Api(API_ROUTES.aircraft.find)
    .params(args)
    .get<IAcft>();
  return data;
};
