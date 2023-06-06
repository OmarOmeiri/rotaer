import { TRequest } from '../../types/API';
import type { FlightPlan } from '../../types/app/fPlan';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';

type FlightPlanRoutes = {
  getUserFlightPlans: TRequest<'flightPlan', 'getUserFlightPlans'>
}

export const getUserFlightPlans: FlightPlanRoutes['getUserFlightPlans']['GET'] = async () => {
  const { data } = await new Api(API_ROUTES.flightPlan.getUserFlightPlans)
    .get<FlightPlan[]>();
  return data || [];
};
