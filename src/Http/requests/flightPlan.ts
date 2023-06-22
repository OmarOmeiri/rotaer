import { TRequest } from '../../types/API';
import type { FlightPlan } from '../../types/app/fPlan';
import { WithStrId } from '../../types/app/mongo';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';
import { WithErrorSuccessFetch } from '../types';

type FlightPlanRoutes = {
  getUserFlightPlans: TRequest<'flightPlan', 'getUserFlightPlans'>
  saveUserFlightPlans: TRequest<'flightPlan', 'saveUserFlightPlans'>
}

export const getUserFlightPlans: WithErrorSuccessFetch<
FlightPlanRoutes['getUserFlightPlans']['GET']
> = async (_, options) => {
  const { data } = await new Api(API_ROUTES.flightPlan.getUserFlightPlans)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .get<WithStrId<FlightPlan>[]>();
  return data || [];
};

export const saveUserFlightPlan: WithErrorSuccessFetch<
FlightPlanRoutes['saveUserFlightPlans']['POST']
> = async (args, options) => {
  await new Api(API_ROUTES.flightPlan.saveUserFlightPlans)
    .body(args)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .post();
  return null;
};

export const editUserFlightPlan: WithErrorSuccessFetch<
FlightPlanRoutes['saveUserFlightPlans']['PATCH']
> = async (args, options) => {
  await new Api(API_ROUTES.flightPlan.saveUserFlightPlans)
    .body(args)
    .onError(options?.onError)
    .onSuccess(options?.onSuccess)
    .patch();
  return null;
};
