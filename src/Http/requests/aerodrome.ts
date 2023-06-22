import { TRequest } from '../../types/API';
import { TAerodrome, TAerodromeData, TAerodromPrelimInfo } from '../../types/app/aerodrome';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';
import { WithErrorSuccessFetch } from '../types';

type FindRoutes = TRequest<'aerodrome', 'find'>
type CoordRoutes = TRequest<'aerodrome', 'coordinates'>
type InfoRoutes = TRequest<'aerodrome', 'info'>

export const fetchAerodromes: WithErrorSuccessFetch<
FindRoutes['GET']
> = async (args, options) => {
  const { data } = await new Api(API_ROUTES.aerodrome.find)
    .params({ id: args.id })
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .get<TAerodrome[]>();
  return data || [];
};

export const fetchCoordinates: WithErrorSuccessFetch<
CoordRoutes['GET']
> = async (args, options) => {
  const req = new Api(API_ROUTES.aerodrome.coordinates)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess);
  if (args) {
    req.params({ id: args?.id });
  }
  const { data } = await req.get<TAerodromPrelimInfo[]>();
  return data || [];
};

export const fetchAerodromeInfo: WithErrorSuccessFetch<
InfoRoutes['GET']
> = async (args, options) => {
  const { data } = await new Api(API_ROUTES.aerodrome.info)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .params({ id: args.id })
    .get<TAerodromeData>();
  return data;
};
