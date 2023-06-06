/* eslint-disable new-cap */
/* eslint-disable func-names */

import { ErrorCodes } from 'lullo-common-types';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import ServerError from '@/utils/Errors/ServerError';
import { checkLocale } from '../../../utils/Locale/locale';
import Translator from '../../../utils/Translate/Translator';
import { verifyJwt } from '../../../utils/jwt/jwt';
import { getCookie } from './cookies';

const paramMap = new Proxy({
  GET: (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    return Object.fromEntries(searchParams);
  },
  POST: async (req: NextRequest) => {
    try {
      const body = await req.json();
      return body;
    } catch {
      return {};
    }
  },
  DELETE: (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    return Object.fromEntries(searchParams);
  },
  PATCH: async (req: NextRequest) => {
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

const setLocale = (req: NextRequest) => {
  const locale = checkLocale(req.headers.get('lang'));
  Translator.setLang(locale);
};

// const setUserId = (req: NextRequest) => {
//   const token = getCookie(req, 'x-auth-token');
//   console.log('HEEELOOO', cookies().getAll());
//   if (!token) return;
//   try {
//     const { userId } = verifyJwt(token);
//     req.headers.set('user-id', userId);
//   } catch {
//     req.headers.delete('user-id');
//   }
// };

/** */
export function controller() {
  return function (target: Class): void {
    const keys = Object.getOwnPropertyNames(target.prototype);

    for (const propertyName of keys) {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
      const originalMethod = descriptor?.value;
      if (descriptor?.value instanceof Function) {
        target.prototype[propertyName] = async function (req: NextRequest) {
          const response = new NextResponse();
          try {
            setLocale(req);
            // setUserId(req);
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
              res: response,
            });

            return NextResponse.json(result, response);
          } catch (error) {
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
