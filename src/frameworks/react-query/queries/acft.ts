import type { MySession } from 'next-auth';
import { API_ROUTES } from '../../../Http/routes';
import { findUserAircraft } from '../../../Http/requests/acft';
import { useMyQuery } from './query';

export const useAcftQuery = (session: MySession) => (
  useMyQuery({
    queryKey: [API_ROUTES.aircraft.findUserAcft, session.user?._id],
    queryFn: () => (session.user?._id ? findUserAircraft({ userId: session.user._id }) : []),
    enabled: !!(session.isAuthenticated && session.user?._id),
    cacheTime: Infinity,
    staleTime: Infinity,
  })
);
