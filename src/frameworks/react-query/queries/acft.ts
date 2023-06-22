import type { MySession } from 'next-auth';
import { API_ROUTES } from '../../../Http/routes';
import { findUserAircraft } from '../../../Http/requests/acft';
import { useMyQuery } from './myQuery';
import { HTTPOnError, HTTPOnSuccess } from '../../../Http/types';

export const useAcftQuery = (session: MySession, options?: {
  onError?: HTTPOnError,
  onSuccess?: HTTPOnSuccess
}) => (
  useMyQuery({
    queryKey: [API_ROUTES.aircraft.findUserAcft, session.user?._id],
    queryFn: () => (session.user?._id ? findUserAircraft({ userId: session.user._id }, {
      onError: options?.onError,
      onSuccess: options?.onSuccess,
    }) : []),
    enabled: !!(session.isAuthenticated && session.user?._id),
    cacheTime: Infinity,
    staleTime: Infinity,
  })
);
