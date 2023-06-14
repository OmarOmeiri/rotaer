import { TRequest } from '../../types/API';
import type { FlightPlan } from '../../types/app/fPlan';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';

type FlightPlanRoutes = {
  getUserFlightPlans: TRequest<'flightPlan', 'getUserFlightPlans'>
  saveUserFlightPlans: TRequest<'flightPlan', 'saveUserFlightPlans'>
}

export const getUserFlightPlans: FlightPlanRoutes['getUserFlightPlans']['GET'] = async () => {
  const { data } = await new Api(API_ROUTES.flightPlan.getUserFlightPlans)
    .get<FlightPlan[]>();
  return data || [];
};

export const saveUserFlightPlan: FlightPlanRoutes['saveUserFlightPlans']['POST'] = async (args) => {
  await new Api(API_ROUTES.flightPlan.saveUserFlightPlans)
    .body(args)
    .post();
  return null;
};
