import { ErrorCodes } from 'lullo-common-types';
import { AllDbs, MongoCollections } from '../../../types/app/mongo';
import ServerError from '../../../utils/Errors/ServerError';
import MongoDb from '../../../db/mongoConnect';

class BaseService {
  private db?: AllDbs;

  protected getDb(colls: typeof MongoCollections[keyof typeof MongoCollections][]) {
    if (!this.db) {
      throw new ServerError('The database was not initialized, please call withDb method before.', {
        status: 500,
        code: ErrorCodes.DBError,
      });
    }
    for (const { alias } of colls) {
      if (!(alias in this.db)) {
        throw new ServerError(`The "${String(alias)}" database was not initialized, please call withDb method before.`, {
          status: 500,
          code: ErrorCodes.DBError,
        });
      }
    }
    return this.db;
  }

  async withDb(dbs: typeof MongoCollections[keyof typeof MongoCollections][]) {
    this.db = await MongoDb(dbs);
    return this;
  }
}

export default BaseService;
