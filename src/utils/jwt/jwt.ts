import jwtDecode from 'jwt-decode';
import jwt from 'jsonwebtoken';

export const decodeJWT = <T>(token: string): T => jwtDecode<T>(token);

export const getJWT = (userId: string, expHours = 24) => {
  const now = Date.now();
  const token = jwt.sign({ userId }, process.env.AUTH_TOKEN_ENCRYPTION_KEY, {
    expiresIn: expHours * 3600,
  });
  return { token, expiresAt: new Date(now + (expHours * 3.6e6)) };
};

export const verifyJwt = (token: string) => (
  jwt.verify(token, process.env.AUTH_TOKEN_ENCRYPTION_KEY) as {userId: string}
);
