import { ObjectId, WithId } from 'mongodb';
import { ErrorCodes } from 'lullo-common-types';
import { AllDbs, MongoCollections } from '../../../types/app/mongo';
import BaseService from '../utils/BaseService';
import type { FlightPlan, SaveFlightPlan } from '../../../types/app/fPlan';
import ServerError from '../../../utils/Errors/ServerError';
import Translator from '../../../utils/Translate/Translator';
import { IAerodromeCoordsSchema, IAerodromeSchema, IRwySchema } from '../../../types/app/aerodrome';

const translator = new Translator({
  adArrNotFound: { 'pt-BR': 'Aeródromo de chegada não encontrado.', 'en-US': 'Arrival aerodrome not found' },
  adDepNotFound: { 'pt-BR': 'Aeródromo de partida não encontrado.', 'en-US': 'Departure aerodrome not found' },
  adAltNotFound: { 'pt-BR': 'Aeródromo de alternativa não encontrado.', 'en-US': 'Alternate aerodrome not found' },
  adCoordsNotFound: { 'pt-BR': 'Houve um erro ao encontrar as coordenadas do aeródromo.', 'en-US': 'Could not find aerodrome coordinates.' },
});

const NotFoundError = (msg: string) => (
  new ServerError(msg, {
    code: ErrorCodes.notFoundError,
    status: 404,
  })
);

const getAdCoords = (ad: WithId<IAerodromeSchema>, coords: WithId<IAerodromeCoordsSchema>[]) => {
  const c = coords.find((c) => c.aerodrome.toString() === ad._id.toString());
  if (c) {
    return {
      decimal: { lon: c.decim[0], lat: c.decim[1] },
      degMinSec: c.deg,
    };
  }
};

const getAdRwys = (ad: WithId<IAerodromeSchema>, rwys: WithId<IRwySchema>[]) => (
  rwys.filter((r) => r.aerodrome.toString() === ad._id.toString())
);

const getCoordsAndRwys = ({
  arr,
  dep,
  alt,
  coords,
  rwys,
}:{
  arr: WithId<IAerodromeSchema>,
  dep: WithId<IAerodromeSchema>,
  alt: WithId<IAerodromeSchema> | null | undefined,
  coords: WithId<IAerodromeCoordsSchema>[],
  rwys: WithId<IRwySchema>[],
}) => {
  const depCoords = getAdCoords(dep, coords);
  const depRwys = getAdRwys(dep, rwys);
  const arrCoords = getAdCoords(arr, coords);
  const arrRwys = getAdRwys(arr, rwys);
  if (!depCoords || !arrCoords) throw NotFoundError(translator.translate('adCoordsNotFound'));
  if (alt) {
    const altCoords = getAdCoords(alt, coords);
    const altRwys = getAdRwys(alt, rwys);
    if (!altCoords) throw NotFoundError(translator.translate('adCoordsNotFound'));
    alt.coords = altCoords;
    alt.rwys = altRwys || [];
  }

  return {
    dep: {
      ...dep,
      _id: dep._id.toString(),
      coords: depCoords,
      rwys: depRwys || [],
    },
    arr: {
      ...arr,
      _id: arr._id.toString(),
      coords: arrCoords,
      rwys: arrRwys || [],
    },
    alt: alt
      ? {
        ...alt,
        _id: alt._id.toString(),
      }
      : undefined,
  };
};

const checkPlanAerodromes = async (plan: SaveFlightPlan, db: AllDbs) => {
  const checkDepAerodrome = await db.aerodromeDb.findOne({ icao: plan.dep });
  if (!checkDepAerodrome) throw NotFoundError(translator.translate('adDepNotFound'));
  const checkArrAerodrome = await db.aerodromeDb.findOne({ icao: plan.arr });
  if (!checkArrAerodrome) throw NotFoundError(translator.translate('adArrNotFound'));
  if (plan.alt) {
    const checkAltAerodrome = await db.aerodromeDb.findOne({ icao: plan.alt });
    if (!checkAltAerodrome) throw NotFoundError(translator.translate('adAltNotFound'));
  }
};

class FlightPlanService extends BaseService {
  async getUserFlightPlans(userId: string) {
    const db = this.getDb([
      MongoCollections.flightPlan,
      MongoCollections.aerodrome,
      MongoCollections.coord,
      MongoCollections.rwy,
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

    const ids = (
      [arrivals, departures, alternates]
        .flat()
        .filter((a) => a) as WithId<IAerodromeSchema>[]
    ).map((a) => a._id);

    const coords = await db.aerodromeCoordsDb.find({
      aerodrome: { $in: ids },
    }).toArray();

    const rwys = await db.runwayDb.find({
      aerodrome: { $in: ids },
    }).toArray();

    return userPlans.reduce((plans, p, i) => {
      const dep = departures[i];
      const arr = arrivals[i];
      const alt = alternates[i];
      if (dep && arr) {
        plans.push({
          ...p,
          ...getCoordsAndRwys({
            dep,
            arr,
            alt,
            coords,
            rwys,
          }),
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

    await checkPlanAerodromes(plan, db);
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

  async editUserFlightPlan(plan: SaveFlightPlan & {id: string}, userId: string) {
    const db = this.getDb([
      MongoCollections.aerodrome,
      MongoCollections.flightPlan,
    ]);

    await checkPlanAerodromes(plan, db);
    await db.flightPlansDb.findOneAndUpdate({
      _id: new ObjectId(plan.id),
    }, {
      $set: {
        name: plan.name,
        arr: plan.arr,
        dep: plan.dep,
        alt: plan.alt,
        route: plan.route,
        userId: new ObjectId(userId),
        createdAt: new Date(),
      },
    }, { upsert: true });
  }
}

export default FlightPlanService;
