import { controller } from '../../utils/controller';
import { TAPI } from '../../../../types/API';

type API = TAPI<'user', 'logIn'>;

@controller()
class LogInRoute implements API {
  async POST(authData : MyRequest<IAuthRequest>) {
    return {
      token: 'hahaha',
      msg: 'Bem vindo, Omar',
      id: 'omar',
      expiresIn: 60000,
    };
  }
}

const cntrl = new LogInRoute();
export const GET = cntrl.POST.bind(cntrl);
