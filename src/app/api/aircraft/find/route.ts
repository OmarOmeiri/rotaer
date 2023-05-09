import MongoDb from '@mongo';
import { ErrorCodes } from 'lullo-common-types';
import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';
import { MongoCollections } from '../../../../types/app/mongo';
import ServerError from '../../../../utils/Errors/ServerError';

type API = TAPI<'acft', 'find'>;

@controller()
class FindAircraft implements API {
  async GET({ reqData: { id } }: MyRequest<{id: string}>) {
    const idFormatted = (id || '').replace(/[^A-Z]/gi, '').toUpperCase();
    if (!idFormatted || !(/^[A-Z]{5}$/.test(idFormatted))) {
      throw new ServerError('Aircraft id not valid.', {
        status: 400,
        code: ErrorCodes.apiUsageError,
      });
    }
    const db = await MongoDb(
      MongoCollections.acft,
    );

    const acft = await db.findOne({ registration: idFormatted });
    return acft;
  }
}

const cntrl = new FindAircraft();
export const GET = cntrl.GET.bind(cntrl);
