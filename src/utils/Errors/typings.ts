import { ErrorCodes } from 'lullo-common-types';

export type TError = 'warn' | 'error';

export interface IClientErr {
  message: string,
  type?: TError,
  timeOut?: number,
  code?: ErrorCodes,
  stack: undefined | string,
  logMsg?: string,
  save?: boolean,
  res?: Error,
  silent?: boolean,
  data?: Record<string, any>
}
