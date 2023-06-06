import type { Session } from 'next-auth';
import { API_ROUTES } from '../../../Http/routes';
import { getUserFlightPlans } from '../../../Http/requests/flightPlan';
import { useMyQuery } from './query';

export const useFlightPlansQuery = (user: Session['user']) => (
  useMyQuery({
    queryKey: [API_ROUTES.flightPlan.getUserFlightPlans, user?._id],
    enabled: !!(user?._id),
    queryFn: () => getUserFlightPlans(undefined),
    cacheTime: Infinity,
    staleTime: Infinity,
  })
);
