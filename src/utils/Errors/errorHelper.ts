/* eslint-disable no-console */
/**
 * @module ErrorHelper
 * @category Errors
 */
/* eslint-disable require-jsdoc */
import { ErrorCodes } from 'lullo-common-types';
import alertStore, { TAlertType } from '../../store/alert/alertStore';
import isDev from '../DEV/isDevEnv';
import { getErrorName } from './helpers';
import {
  IClientErr,
  TError,
} from './typings';

const getType = (type?: TError): TAlertType => {
  if (!type) return 'error';
  if (type && (type === 'error' || type === 'warn')) return type as TAlertType;
  return 'error';
};

export default function errorHelper(err: IClientErr | Error): void {
  const {
    message,
    code = ErrorCodes.unknownError,
    type,
    timeOut,
    stack,
    logMsg,
    silent,
  } = err as IClientErr;

  if (isDev()) {
    console.log(`%cERROR MSG: ${message}`, 'background-color: red; color: white; font-weight: bold; display: block');
    console.log(`%cERROR CODE: ${code} - ${getErrorName(code)}`, 'background-color: red; color: white; font-weight: bold');
    if (stack) console.error(stack);
    if (logMsg) console.error(logMsg);
  }

  if (message && !silent) {
    const { setAlert } = alertStore.getState();
    setAlert({ msg: message, type: getType(type), timeout: timeOut });
  } else if (!silent) {
    const { setAlert } = alertStore.getState();
    setAlert({ msg: 'Houve um erro desconhecido.', type: getType(type), timeout: timeOut });
  }
}
