import alertStore from '../../store/alert/alertStore';
import { TRequest } from '../../types/API';
import { WithStrId } from '../../types/app/mongo';
import Translator from '../../utils/Translate/Translator';
import Api from '../HTTPRequest';
import { API_ROUTES } from '../routes';

type AcftRoutes ={
  find: TRequest<'acft', 'find'>,
  save: TRequest<'acft', 'save'>
  findUserAcft: TRequest<'acft', 'findUserAcft'>,
  deleteUserAcft: TRequest<'acft', 'deleteUserAcft'>,
  editUserAcft: TRequest<'acft', 'editUserAcft'>,
}

const translator = new Translator({
  savedSuccess: { 'en-US': 'Aircraft saved successfully.', 'pt-BR': 'Aeronave salva com sucesso.' },
});

export const findAircraft: AcftRoutes['find']['GET'] = async (args) => {
  const { data } = await new Api(API_ROUTES.aircraft.find)
    .params(args)
    .get<WithStrId<IAcft>>();
  return data;
};

export const findUserAircraft: AcftRoutes['findUserAcft']['GET'] = async (args) => {
  const { data } = await new Api(API_ROUTES.aircraft.findUserAcft)
    .params(args)
    .get<WithStrId<IUserAcft>[]>();
  return data || [];
};

export const deleteUserAircraft: AcftRoutes['deleteUserAcft']['DELETE'] = async (args) => {
  await new Api(API_ROUTES.aircraft.deleteUserAcft)
    .params(args)
    .delete<null>();
  return null;
};

export const editUserAircraft: AcftRoutes['editUserAcft']['PATCH'] = async (args) => {
  await new Api(API_ROUTES.aircraft.editUserAcft)
    .body(args)
    .patch<null>();
  return null;
};

export const saveAircraft: AcftRoutes['save']['POST'] = async (args) => {
  const { data } = await new Api(API_ROUTES.aircraft.save)
    .params(args)
    .onSuccess(() => alertStore
      .getState()
      .setAlert({ msg: translator.translate('savedSuccess'), type: 'success' }))
    .get<WithStrId<IAcft>>();

  return data;
};
