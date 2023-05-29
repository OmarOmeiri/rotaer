/* eslint-disable new-cap */
/* eslint-disable func-names */

import { ErrorCodes } from 'lullo-common-types';
import { NextResponse } from 'next/server';
import ServerError from '@/utils/Errors/ServerError';
import { checkLocale } from '../../../utils/Locale/locale';
import Translator from '../../../utils/Translate/Translator';

const paramMap = new Proxy({
  GET: (req: Request) => {
    const { searchParams } = new URL(req.url);
    return Object.fromEntries(searchParams);
  },
  POST: async (req: Request) => {
    try {
      const body = await req.json();
      return body;
    } catch {
      return {};
    }
  },
  DELETE: (req: Request) => {
    const { searchParams } = new URL(req.url);
    return Object.fromEntries(searchParams);
  },
  PATCH: async (req: Request) => {
    try {
      const body = await req.json();
      return body;
    } catch {
      return {};
    }
  },
}, {
  get: (target, property) => {
    if (property in target) {
      return target[property as keyof typeof target];
    }
    return () => null;
  },
});

/** */
export function controller() {
  return function (target: Class): void {
    const keys = Object.getOwnPropertyNames(target.prototype);

    for (const propertyName of keys) {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
      const originalMethod = descriptor?.value;
      if (descriptor?.value instanceof Function) {
        target.prototype[propertyName] = async function (req: Request) {
          const locale = checkLocale(req.headers.get('lang'));
          Translator.setLang(locale);
          try {
            const params = await paramMap[req.method as keyof typeof paramMap](req);
            if (!params) {
              throw new ServerError('Invalid HTTP verb', {
                status: 500,
                req,
                code: ErrorCodes.notAllowedError,
              });
            }
            const result = await originalMethod({
              req,
              reqData: params,
            });
            return NextResponse.json(result);
          } catch (error) {
            console.info('error: ', error);
            return new NextResponse(
              JSON.stringify({
                message: error.message || 'An unknown error has occurred',
                code: error.code || undefined,
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: error.status || 500,
              },
            );
          }
        };
      }
    }
  };
}
