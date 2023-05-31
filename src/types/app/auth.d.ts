type NativeAuthRequest = {
  username: string,
  password: string,
}

type GoogleAuthRequest = {
  username: string,
}

/**
* User authentication response interface
*/
interface IAuthResponse {
  token?: string;
  msg?: string;
  id: string;
  expiresAt: Date,
}

type JWTPayload = {
  id: string;
};