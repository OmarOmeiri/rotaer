import type DeleteAcftModal from '../../components/Modal/ModalContents/acft/DeleteAcftModal';
import type EditAcftModal from '../../components/Modal/ModalContents/acft/EditAcftModal';
import type LogInModal from '../../components/Modal/ModalContents/auth/LogInModal';
import type ResetPasswordModal from '../../components/Modal/ModalContents/auth/ResetPasswordModal';
import type AddWaypointModal from '../../components/Modal/ModalContents/fplan/AddWaypointModal';

const AuthModals = [
  'logIn',
  'changePassword',
  'forgotPassword',
  'resetPassword',
] as const;

const acftModals = [
  'deleteAcftModal',
  'editAcftModal',
] as const;

const routeModals = [
  'addWptModal',
] as const;

export const allModals = [
  ...AuthModals,
  ...acftModals,
  ...routeModals,
] as const;

export type allModals = ElementType<typeof allModals>
export type modalChildProps<T extends allModals> =
T extends 'logIn'
? FirstParameter<typeof LogInModal>
:T extends 'resetPassword'
? FirstParameter<typeof ResetPasswordModal>
:T extends 'deleteAcftModal'
? FirstParameter<typeof DeleteAcftModal>
:T extends 'editAcftModal'
? FirstParameter<typeof EditAcftModal>
:T extends 'addWptModal'
? FirstParameter<typeof AddWaypointModal>
: undefined

