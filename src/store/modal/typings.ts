const AuthModals = [
  'logIn',
  'changePassword',
  'forgotPassword',
  'resetPassword',
] as const;

const tableModals = [
  'saveTableColumns',
  'deleteTableColumns',
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
  ...tableModals,
  ...acftModals,
  ...routeModals,
] as const;

export type allModals = ElementType<typeof allModals>
export type modalChildProps<T extends allModals> = any
// T extends 'logIn'
// ? FirstParameter<typeof LogInModal>
// : T extends 'resetPassword'
// ? FirstParameter<typeof ResetPasswordModal>
// : T extends 'saveTableColumns'
// ? FirstParameter<typeof SaveTableModal>
// : T extends 'deleteTableColumns'
// ? FirstParameter<typeof DeleteTableColumnsModal>
// : undefined

