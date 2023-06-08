import type { ParsedForms } from '../../../../../../../hooks/Forms/useForm';
import type { TAerodromeData } from '../../../../../../../types/app/aerodrome';
import { RouteWaypoint } from '../../../../../../../utils/Route/Route';
import { LengthConverter } from '../../../../../../../utils/converters/length';
import type { newFlightPlanAcftFormData } from '../forms';
import type { newFlightPlanAcftValidator } from '../validation';

export const aerodromeToRouteWaypoint = ({
  ad,
  acftData,
  fixed,
  alternate,
}: {
  ad: TAerodromeData | null,
  acftData: ParsedForms<typeof newFlightPlanAcftFormData, typeof newFlightPlanAcftValidator>,
  fixed?: boolean,
  alternate?: boolean,
}): RouteWaypoint | null => (
  ad
    ? new RouteWaypoint({
      name: ad.icao,
      type: 'ad',
      coord: ad.coords,
      windSpeed: null,
      windDirection: null,
      ias: acftData?.ias || 0,
      altitude: Math.round(LengthConverter.M(ad.elev).toFt() + 1000),
      fixed: fixed || false,
      alternate: alternate || false,
    })

    : null
);
