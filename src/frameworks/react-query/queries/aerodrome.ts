import { API_ROUTES } from '../../../Http/routes';
import { useMyQuery } from './query';
import { fetchAerodromes } from '../../../Http/requests/aerodrome';

export const useAerodromeQuery = (key: string, enabled: boolean) => (
  useMyQuery({
    queryKey: [API_ROUTES.aerodrome.find, key],
    queryFn: () => fetchAerodromes({ id: key }),
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
  })
);
