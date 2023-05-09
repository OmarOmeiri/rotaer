export interface IRegisterUserSuccess {
  token?: string;
  msg?: string;
}

export interface IUserModel {
  _id: string;
  email: string;
  date: Date;
}

export type UserOmitPassword = Omit<IUserModel, 'password'>
