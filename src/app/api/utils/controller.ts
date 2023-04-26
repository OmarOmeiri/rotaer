/* eslint-disable new-cap */
/* eslint-disable func-names */

import { ErrorCodes } from 'lullo-common-types';
import { NextResponse } from 'next/server';
import ServerError from '@/utils/Errors/ServerError';

/**
 * Gets all metadata inserted by the other decorators in the routes
 * and generated all router objects with middlewares.
 * @module ControllerDecorator
 * @category Decorators
 */

const paramMap = {
  GET: (req: Request) => {
    const { searchParams } = new URL(req.url);
    return Object.fromEntries(searchParams);
  },
};

/**
 * The Platform controller decorator.
 * It creates all the API routes and adds
 * custom middlewares from the controllers decorators
 * @param routePrefix
 */
export function controller() {
  return function (target: Class): void {
    const keys = Object.getOwnPropertyNames(target.prototype);

    for (const propertyName of keys) {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
      const originalMethod = descriptor?.value;
      // const isEnvProtected: TypeOrArrayOfType<NODE_ENV> = Reflect.getMetadata(MetadataKeys.envProtected, target.prototype, propertyName);

      if (descriptor?.value instanceof Function) {
        target.prototype[propertyName] = async function (req: Request) {
          try {
            const params = paramMap[req.method as keyof typeof paramMap](req);
            if (!params) {
              throw new ServerError('Invalid HTTP verb', {
                status: 500,
                req,
                code: ErrorCodes.notAllowedError
              });
            }
            const result = await originalMethod({
              ...req,
              reqData: params,
            });
            return NextResponse.json(result);
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
            )
          }
        };
      }

      // const middlewares = [...Reflect.getMetadata(MetadataKeys.middleware, target.prototype, propertyName) || []];
      // if (isEnvProtected) middlewares.push(envProtected(isEnvProtected));
    }
  };
}
