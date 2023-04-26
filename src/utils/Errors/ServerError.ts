/**
 * @module ServerError
 * @category ErrorHandling
 *
 * This class should be used to throw all server errors.
 *
 * Custom error names will be thrown depending on the 'code' property.
 *
 * You can throw Errors with 'throw new ServerError(...)'
 * or just create error logs with 'new ServerError(...).log()'
 */
import { ErrorCodes } from 'lullo-common-types';
import { TError } from './typings';

type ErrType = {
  status: number | string,
  type?: TError,
  req?: Request
  data?: Record<string, any>,
  code: ErrorCodes,
  stack?: string
} & Record<string, any>

class ServerError extends Error {
  status: number | string;
  type: TError;
  code?: ErrorCodes;
  req?: Request;
  stack?: string;
  data?: Record<string, any>;

  constructor(err: string, errData?: ErrType) {
    super(err);
    this.status = errData?.status || 500;
    this.type = errData?.type || 'error';
    this.code = errData?.code || ErrorCodes.unknownError;
    this.req = errData?.req;
    this.data = errData?.data;
    this.stack = errData?.stack;
    if (!this.stack) Error.captureStackTrace(this, this.constructor);
  }
}

export default ServerError;
