import type { ParsedForms } from '../../../../../../../hooks/Forms/useForm';
import type { TAerodromeData } from '../../../../../../../types/app/aerodrome';
import { RouteWaypoint, TRouteAdType } from '../../../../../../../utils/Route/Route';
import { LengthConverter } from '../../../../../../../utils/converters/length';
import type { newFlightPlanAcftFormData } from '../forms';
import type { newFlightPlanAcftValidator } from '../validation';

export const aerodromeToRouteWaypoint = ({
  ad,
  acftData,
  adType,
  fixed,
  alternate,
}: {
  ad: TAerodromeData | null,
  acftData: ParsedForms<typeof newFlightPlanAcftFormData, typeof newFlightPlanAcftValidator>,
  adType: TRouteAdType,
  fixed?: boolean,
  alternate?: boolean,
}): RouteWaypoint | null => (
  ad
    ? new RouteWaypoint({
      name: ad.icao,
      type: 'ad',
      adType,
      coord: ad.coords,
      windSpeed: null,
      windDirection: null,
      ias: acftData?.ias || 0,
      altitude: LengthConverter.M(ad.elev).toFt(),
      fixed: fixed || false,
      alternate: alternate || false,
    })

    : null
);
