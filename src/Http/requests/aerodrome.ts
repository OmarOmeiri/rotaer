import { TRequest } from '../../types/API';
import { TAerodrome, TAerodromeData, TAerodromPrelimInfo } from '../../types/app/aerodrome';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';

type FindRoutes = TRequest<'aerodrome', 'find'>
type CoordRoutes = TRequest<'aerodrome', 'coordinates'>
type InfoRoutes = TRequest<'aerodrome', 'info'>

export const fetchAerodrome: FindRoutes['GET'] = async (args) => {
  const { data } = await new Api(API_ROUTES.aerodrome.find)
    .params({ id: args.id })
    .get<TAerodrome[]>();
  return data || [];
};

export const fetchCoordinates: CoordRoutes['GET'] = async (args) => {
  const req = new Api(API_ROUTES.aerodrome.coordinates);
  if (args) {
    req.params({ id: args?.id });
  }
  const { data } = await req.get<TAerodromPrelimInfo[]>();
  return data || [];
};

export const fetchAerodromeInfo: InfoRoutes['GET'] = async (args) => {
  const { data } = await new Api(API_ROUTES.aerodrome.info)
    .params({ id: args.id })
    .get<TAerodromeData>();
  return data;
};
