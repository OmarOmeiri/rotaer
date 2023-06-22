import type { Session } from 'next-auth';
import { API_ROUTES } from '../../../Http/routes';
import { getUserFlightPlans } from '../../../Http/requests/flightPlan';
import { useMyQuery } from './myQuery';
import { HTTPOnError, HTTPOnSuccess } from '../../../Http/types';

export const useFlightPlansQuery = (
  user: Session['user'],
  options?: {
    enabled?: boolean
    onError?: HTTPOnError,
    onSuccess?: HTTPOnSuccess
  },
) => (
  useMyQuery({
    queryKey: [API_ROUTES.flightPlan.getUserFlightPlans, user?._id],
    enabled: options?.enabled || !!(user?._id),
    queryFn: () => getUserFlightPlans(undefined, {
      onError: options?.onError,
      onSuccess: options?.onSuccess,
    }),
    cacheTime: Infinity,
    staleTime: Infinity,
  })
);
