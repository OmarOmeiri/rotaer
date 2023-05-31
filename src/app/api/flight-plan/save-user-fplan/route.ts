import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import FlightPlanService from '../Service';
import { protectedRoute } from '../../utils/protectedRoute';
import { COMMON_API_ERRORS } from '../../utils/Errors';
import type { MyRequest } from '../../../../types/request';
import type { FlightPlan } from '../../../../types/app/fPlan';

type API = TAPI<'flightPlan', 'saveUserFlightPlans'>;

@controller()
class SaveUserFlightPlans implements API {
  @protectedRoute()
  async POST({ req, reqData }: MyRequest<FlightPlan>) {
    const userId = req.headers.get('user-id');
    if (!userId) {
      throw COMMON_API_ERRORS.unauthorized();
    }
    const service = new FlightPlanService();
    await service.withDb([
      MongoCollections.flightPlan,
      MongoCollections.aerodrome,
      MongoCollections.acft,
    ]);
    await service.saveUserFlightPlan(reqData, userId);
    return null;
  }
}

export const { POST } = new SaveUserFlightPlans() as unknown as MyController<SaveUserFlightPlans>;
