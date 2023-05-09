import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';

type API = TAPI<'user', 'load'>;

@controller()
class LoadUserRoute implements API {
  async POST() {
    return {
      _id: 'kajkalkala',
      email: 'jao@ninguem.com.br',
      date: new Date(),
    };
  }
}

const cntrl = new LoadUserRoute();
export const GET = cntrl.POST.bind(cntrl);
