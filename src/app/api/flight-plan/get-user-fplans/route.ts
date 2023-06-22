import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections, WithStrId } from '../../../../types/app/mongo';
import FlightPlanService from '../Service';
import { protectedRoute } from '../../utils/protectedRoute';
import { COMMON_API_ERRORS } from '../../utils/Errors';
import type { MyRequest } from '../../../../types/request';
import type { FlightPlan } from '../../../../types/app/fPlan';

type API = TAPI<'flightPlan', 'getUserFlightPlans'>;

@controller()
class GetUserFlightPlans implements API {
  @protectedRoute()
  async GET({ req }: MyRequest<undefined>) {
    const userId = req.headers.get('user-id');
    if (!userId) {
      throw COMMON_API_ERRORS.unauthorized();
    }
    const service = new FlightPlanService();
    await service.withDb([
      MongoCollections.flightPlan,
      MongoCollections.aerodrome,
      MongoCollections.coord,
      MongoCollections.rwy,
    ]);
    const plans = await service.getUserFlightPlans(userId) as WithStrId<FlightPlan>[];
    return plans;
  }
}

export const { GET } = new GetUserFlightPlans() as unknown as MyController<GetUserFlightPlans>;
