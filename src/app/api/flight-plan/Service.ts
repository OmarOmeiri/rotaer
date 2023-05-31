import { ObjectId } from 'mongodb';
import { ErrorCodes } from 'lullo-common-types';
import { MongoCollections } from '../../../types/app/mongo';
import BaseService from '../utils/BaseService';
import type { FlightPlan } from '../../../types/app/fPlan';
import ServerError from '../../../utils/Errors/ServerError';
import Translator from '../../../utils/Translate/Translator';
import { COMMON_API_ERRORS } from '../utils/Errors';

const translator = new Translator({
  adArrNotFound: { 'pt-BR': 'Aeródromo de chegada não encontrado.', 'en-US': 'Arrival aerodrome not found' },
  adDepNotFound: { 'pt-BR': 'Aeródromo de partida não encontrado.', 'en-US': 'Departure aerodrome not found' },
});

const NotFoundError = (msg: string) => (
  new ServerError(msg, {
    code: ErrorCodes.notFoundError,
    status: 404,
  })
);

class FlightPlanService extends BaseService {
  async getUserFlightPlans(userId: string) {
    const db = this.getDb([
      MongoCollections.flightPlan,
      MongoCollections.aerodrome,
    ]);

    const userPlans = await db.flightPlansDb.find({ userId: new ObjectId(userId) }).toArray();
    const arrivals = await Promise.all(userPlans.map((p) => (
      db.aerodromeDb.findOne({ _id: new ObjectId(p.arr) })
    )));

    const departures = await Promise.all(userPlans.map((p) => (
      db.aerodromeDb.findOne({ _id: new ObjectId(p.dep) })
    )));

    const acfts = await Promise.all(userPlans.map((p) => (
      db.userAcftsDb.findOne({ _id: new ObjectId(p.acft) })
    )));

    return userPlans.map((p, i) => ({
      ...p,
      acft: acfts[i],
      dep: departures[i],
      arr: arrivals[i],
    })) as unknown as FlightPlan[];
  }

  async saveUserFlightPlan(plan: FlightPlan, userId: string) {
    const db = this.getDb([
      MongoCollections.aerodrome,
      MongoCollections.acft,
      MongoCollections.flightPlan,
    ]);

    const acftId = new ObjectId(plan.acft._id);
    const adDepId = new ObjectId(plan.dep._id);
    const adArrId = new ObjectId(plan.arr._id);

    const checkDepAerodrome = await db.aerodromeDb.findOne({ _id: adDepId });
    if (!checkDepAerodrome) throw NotFoundError(translator.translate('adDepNotFound'));
    const checkArrAerodrome = await db.aerodromeDb.findOne({ _id: adArrId });
    if (!checkArrAerodrome) throw NotFoundError(translator.translate('adArrNotFound'));
    const checkAcft = await db.userAcftsDb.findOne({ _id: acftId });
    if (!checkAcft) throw COMMON_API_ERRORS.acftNotFound();
    await db.flightPlansDb.insertOne({
      name: plan.name,
      acft: acftId,
      arr: adArrId,
      dep: adDepId,
      userId: new ObjectId(userId),
      createdAt: new Date(),
    });
  }
}

export default FlightPlanService;
