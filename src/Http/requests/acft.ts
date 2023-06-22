import { TRequest } from '../../types/API';
import { WithStrId } from '../../types/app/mongo';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';
import { WithErrorSuccessFetch } from '../types';

type AcftRoutes ={
  find: TRequest<'acft', 'find'>,
  save: TRequest<'acft', 'save'>
  findUserAcft: TRequest<'acft', 'findUserAcft'>,
  deleteUserAcft: TRequest<'acft', 'deleteUserAcft'>,
  editUserAcft: TRequest<'acft', 'editUserAcft'>,
}

export const findAircraft: WithErrorSuccessFetch<
AcftRoutes['find']['GET']
> = async (args, options) => {
  const { data } = await new Api(API_ROUTES.aircraft.find)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .params(args)
    .get<WithStrId<IAcft>>();
  return data;
};

export const findUserAircraft: WithErrorSuccessFetch<
AcftRoutes['findUserAcft']['GET']
> = async (args, options) => {
  const { data } = await new Api(API_ROUTES.aircraft.findUserAcft)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .params(args)
    .get<WithStrId<IUserAcft>[]>();
  return data || [];
};

export const deleteUserAircraft: WithErrorSuccessFetch<
AcftRoutes['deleteUserAcft']['DELETE']
> = async (args, options) => {
  await new Api(API_ROUTES.aircraft.deleteUserAcft)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .params(args)
    .delete<null>();
  return null;
};

export const editUserAircraft: WithErrorSuccessFetch<
AcftRoutes['editUserAcft']['PATCH']
> = async (args, options) => {
  await new Api(API_ROUTES.aircraft.editUserAcft)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .body(args)
    .patch<null>();
  return null;
};

export const saveAircraft: WithErrorSuccessFetch<
AcftRoutes['save']['POST']
> = async (args, options) => {
  const { data } = await new Api(API_ROUTES.aircraft.save)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .params(args)
    .get<WithStrId<IAcft>>();

  return data;
};
