import { ErrorCodes } from 'lullo-common-types';
import errorHelper from './errorHelper';
import {
  IClientErr,
  TError,
} from './typings';
import warnHelper from './warnHelper';

type ErrData = Omit<IClientErr, 'msg'>;

export class ClientError extends Error {
  public type?: TError;
  public timeOut?: number;
  public stack: string | undefined;
  public code?: ErrorCodes;
  public logMsg?: string;
  public save?: boolean;
  public res?: Error;
  public silent?: boolean;
  public data?: Record<string, any>;

  constructor(err: string, errData?: Omit<ErrData, 'message'>) {
    super(err);
    this.type = errData?.type || 'error';
    this.timeOut = errData?.timeOut;
    this.logMsg = errData?.logMsg;
    this.save = errData?.save;
    this.code = errData?.code;
    this.res = errData?.res;
    this.silent = errData?.silent;
    this.stack = errData?.stack;
    this.data = errData?.data;
    if (!this.stack) Error.captureStackTrace(this, this.constructor);

    if (this.type === 'warn') {
      warnHelper(this);
    } else if (this.type === 'error') {
      errorHelper(this);
    }
  }
}
