import { ObjectId } from 'mongodb';
import { ErrorCodes } from 'lullo-common-types';
import { MongoCollections } from '../../../types/app/mongo';
import BaseService from '../utils/BaseService';
import type { FlightPlan, SaveFlightPlan } from '../../../types/app/fPlan';
import ServerError from '../../../utils/Errors/ServerError';
import Translator from '../../../utils/Translate/Translator';
import { COMMON_API_ERRORS } from '../utils/Errors';

const translator = new Translator({
  adArrNotFound: { 'pt-BR': 'Aeródromo de chegada não encontrado.', 'en-US': 'Arrival aerodrome not found' },
  adDepNotFound: { 'pt-BR': 'Aeródromo de partida não encontrado.', 'en-US': 'Departure aerodrome not found' },
  adAltNotFound: { 'pt-BR': 'Aeródromo de alternativa não encontrado.', 'en-US': 'Alternate aerodrome not found' },
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
      db.aerodromeDb.findOne({ icao: p.arr })
    )));

    const departures = await Promise.all(userPlans.map((p) => (
      db.aerodromeDb.findOne({ icao: p.dep })
    )));

    const alternates = await Promise.all(userPlans.map((p) => {
      if (!p.alt) return undefined;
      return db.aerodromeDb.findOne({ icao: p.alt });
    }));

    return userPlans.reduce((plans, p, i) => {
      const dep = departures[i];
      const arr = arrivals[i];
      const alt = alternates[i];
      if (dep && arr) {
        plans.push({
          ...p,
          dep: {
            ...dep,
            _id: dep._id.toString(),
          },
          arr: {
            ...arr,
            _id: arr._id.toString(),
          },
          alt: alt
            ? {
              ...alt,
              _id: alt._id.toString(),
            } : undefined,
        });
      }
      return plans;
    }, [] as FlightPlan[]);
  }

  async saveUserFlightPlan(plan: SaveFlightPlan, userId: string) {
    const db = this.getDb([
      MongoCollections.aerodrome,
      MongoCollections.flightPlan,
    ]);

    const checkDepAerodrome = await db.aerodromeDb.findOne({ icao: plan.dep });
    if (!checkDepAerodrome) throw NotFoundError(translator.translate('adDepNotFound'));
    const checkArrAerodrome = await db.aerodromeDb.findOne({ icao: plan.arr });
    if (!checkArrAerodrome) throw NotFoundError(translator.translate('adArrNotFound'));
    if (plan.alt) {
      const checkAltAerodrome = await db.aerodromeDb.findOne({ icao: plan.alt });
      if (!checkAltAerodrome) throw NotFoundError(translator.translate('adAltNotFound'));
    }
    await db.flightPlansDb.insertOne({
      name: plan.name,
      arr: plan.arr,
      dep: plan.dep,
      alt: plan.alt,
      route: plan.route,
      userId: new ObjectId(userId),
      createdAt: new Date(),
    });
  }
}

export default FlightPlanService;
