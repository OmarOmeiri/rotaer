import jwtDecode from 'jwt-decode';
import jwt from 'jsonwebtoken';

export const decodeJWT = <T>(token: string): T => jwtDecode<T>(token);

export const getJWT = (userId: string) => (
  jwt.sign({ userId }, process.env.AUTH_TOKEN_ENCRYPTION_KEY, {
    expiresIn: '24h',
  })
);

export const verifyJwt = (token: string) => (
  jwt.verify(token, process.env.AUTH_TOKEN_ENCRYPTION_KEY) as {userId: string}
);
