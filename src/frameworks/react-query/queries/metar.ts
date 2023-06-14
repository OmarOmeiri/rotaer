import dayjs from 'dayjs';
import { useQueries } from '@tanstack/react-query';
import { fetchAerodromeMETAR } from '../../../Http/requests/metar';
import { TimeConverter } from '../../../utils/converters/time';

const timeToNextHour = () => {
  const now = dayjs();
  const nextHour = now.add(1, 'hour').startOf('hour');
  return nextHour.diff(now, 'ms') + TimeConverter.MIN(10).toMs();
};

export const useMetarQueries = (icaos: string[]) => (
  useQueries({
    queries: Array.from(new Set(icaos))
      .map((icao) => ({
        queryKey: ['raw-metar', icao],
        queryFn: () => fetchAerodromeMETAR({ icao }),
        cacheTime: timeToNextHour(),
        staleTime: timeToNextHour(),
      })),
  })
);
