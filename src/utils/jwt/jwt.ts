import jwt from 'jwt-decode';

export const decodeJWT = <T>(token: string): T => jwt<T>(token);
