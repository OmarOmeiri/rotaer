interface IAuthRequest {
  email: string;
}

/**
* User authentication response interface
*/
interface IAuthResponse {
  token?: string;
  msg?: string;
  id: string;
  expiresIn: number;
}

type JWTPayload = {
  id: string;
};