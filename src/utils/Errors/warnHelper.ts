/* eslint-disable no-console */
/* eslint-disable require-jsdoc */
import { ErrorCodes } from 'lullo-common-types';
import alertStore from '../../store/alert/alertStore';
import isDev from '../DEV/isDevEnv';
import { getErrorName } from './helpers';
import { IClientErr } from './typings';

interface warn extends NestedPartialK<IClientErr, 'trace'> {
  alert?: boolean,
}

export default function warnHelper(warning: warn): void {
  const {
    message,
    code = ErrorCodes.unknownError,
    timeOut,
    stack,
    save,
    logMsg,
    alert,
  } = warning;

  const devMode = isDev();

  if (devMode) {
    console.log(
      `%cWARN MSG: ${message}`,
      'background-color: #ffb029; color: black; font-weight: bold; display: block',
    );

    console.log(
      `%cCODE: ${code} - ${getErrorName(code)}`,
      'background-color: #ffb029; color: black; font-weight: bold',
    );

    if (logMsg) console.warn(logMsg);
    if (stack) console.warn(stack);
    if (save) console.warn({ save });
  }

  if (message && devMode) {
    const { setAlert } = alertStore.getState();
    setAlert({ msg: message, type: 'warning', timeout: timeOut });
  }

  if (message && alert && !devMode) {
    const { setAlert } = alertStore.getState();
    setAlert({ msg: message, type: 'warning', timeout: timeOut });
  }
}
