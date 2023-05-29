interface IUserSchema {
  username: string;
  password?: string,
  acfts?: string[]
}

interface IRegisterUserSuccess {
  token?: string;
  msg?: string;
}
type UserOmitPassword = Omit<IUserSchema, 'password'>