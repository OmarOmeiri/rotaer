import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import FlightPlanService from '../Service';
import { protectedRoute } from '../../utils/protectedRoute';
import { COMMON_API_ERRORS } from '../../utils/Errors';
import type { MyRequest } from '../../../../types/request';

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
    ]);
    const auth = await service.getUserFlightPlans(userId);
    return auth;
  }
}

export const { GET } = new GetUserFlightPlans() as unknown as MyController<GetUserFlightPlans>;
