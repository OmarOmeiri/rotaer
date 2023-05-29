import { ErrorCodes } from 'lullo-common-types';
import { ObjectId } from 'mongodb';
import { filterObjectByKeys } from 'lullo-utils/Arrays';
import ServerError from '../../../utils/Errors/ServerError';
import BaseService from '../utils/BaseService';
import { MongoCollections, WithStrId } from '../../../types/app/mongo';
import Translator from '../../../utils/Translate/Translator';
import { COMMON_API_ERRORS } from '../utils/Errors';

const translator = new Translator({
  invalidAcftId: { 'en-US': 'Invalid aircraft register', 'pt-BR': 'Registro da aeronave inválido' },
});

const editableAcftFields: (keyof IUserAcft)[] = [
  'climbRate',
  'descentRate',
  'ias',
  'usableFuel',
  'climbFuelFlow',
  'cruiseFuelFlow',
  'descentFuelFlow',
];

class AcftService extends BaseService {
  async find(id: string) {
    const idFormatted = (id || '').replace(/[^A-Z]/gi, '').toUpperCase();
    if (!idFormatted || !(/^[A-Z]{5}$/.test(idFormatted))) {
      throw new ServerError(translator.translate('invalidAcftId'), {
        status: 400,
        code: ErrorCodes.apiUsageError,
      });
    }
    const db = this.getDb([MongoCollections.acft]);

    const acft = await db.acftsDb.findOne({ registration: idFormatted });
    return acft;
  }

  async findUserAcft(userId: string) {
    const db = this.getDb([
      MongoCollections.user,
      MongoCollections.userAcft,
    ]);
    const user = await db.userDb.findOne({
      _id: new ObjectId(userId),
    });
    if (!user) {
      throw COMMON_API_ERRORS.userNotFound();
    }
    if (!user.acfts) return [];
    const userAcfts = await db.userAcftsDb.find({
      userId,
      acftId: { $in: user.acfts },
    }).toArray();
    return userAcfts as unknown as WithStrId<IUserAcft>[];
  }

  async save(userId: string, acftId: string) {
    const db = this.getDb([
      MongoCollections.user,
      MongoCollections.userAcft,
      MongoCollections.acft,
    ]);
    await db.userDb.updateOne({
      _id: new ObjectId(userId),
    }, {
      $addToSet: { acfts: acftId },
    });

    const userAcft = await db.userAcftsDb.findOne({ acftId, userId });
    if (userAcft) return;
    const acft = await db.acftsDb.findOne({ _id: new ObjectId(acftId) });
    if (!acft) {
      throw COMMON_API_ERRORS.acftNotFound();
    }
    await db.userAcftsDb.insertOne({
      registration: acft.registration,
      model: acft.model,
      type: acft.type,
      manufacturer: acft.manufacturer,
      userId,
      acftId,
    });
  }

  async delete(userId: string, acftId: string) {
    const db = this.getDb([
      MongoCollections.user,
      MongoCollections.userAcft,
    ]);

    const userAcft = await db.userAcftsDb.findOne({ _id: new ObjectId(acftId) });
    if (!userAcft) {
      throw COMMON_API_ERRORS.acftNotFound();
    }

    const user = await db.userDb.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw COMMON_API_ERRORS.userNotFound();
    }
    if (!user.acfts) return;
    await db.userDb.updateOne({ _id: new ObjectId(userId) }, {
      $pull: { acfts: userAcft.acftId },
    });

    await db.userAcftsDb.deleteOne({ _id: new ObjectId(acftId) });
  }

  async patch(acft: WithStrId<IUserAcft>) {
    const db = this.getDb([
      MongoCollections.userAcft,
    ]);

    const toEdit = filterObjectByKeys(acft, editableAcftFields, false);

    await db.userAcftsDb.updateOne({ _id: new ObjectId(acft._id) }, { $set: toEdit });
  }
}

export default AcftService;
