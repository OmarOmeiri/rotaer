import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import FlightPlanService from '../Service';
import { protectedRoute } from '../../utils/protectedRoute';
import { COMMON_API_ERRORS } from '../../utils/Errors';
import type { MyRequest } from '../../../../types/request';
import type { SaveFlightPlan } from '../../../../types/app/fPlan';

type API = TAPI<'flightPlan', 'saveUserFlightPlans'>;

@controller()
class SaveUserFlightPlans implements API {
  @protectedRoute()
  async POST({ req, reqData }: MyRequest<SaveFlightPlan>) {
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

  @protectedRoute()
  async PATCH({ req, reqData }: MyRequest<SaveFlightPlan & {id: string}>) {
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

    await service.editUserFlightPlan(reqData, userId);
    return null;
  }
}

export const { POST, PATCH } = new SaveUserFlightPlans() as unknown as MyController<SaveUserFlightPlans>;
