import { ErrorCodes } from 'lullo-common-types';

export const getErrorName = (code: ErrorCodes) => Object.keys(
  ErrorCodes,
).find((key) => ErrorCodes[key as keyof typeof ErrorCodes] === code) || ErrorCodes.unknownError;


