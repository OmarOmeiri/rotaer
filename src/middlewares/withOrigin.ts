import {
  NextResponse,
  NextFetchEvent,
  NextRequest,
  NextMiddleware,
} from 'next/server';

import { MiddlewareFactory } from './types';

const ALLOWED_ORIGINS = [
  'https://www.rotaer.com',
];

const withOriginMiddleware: MiddlewareFactory = (next: NextMiddleware) => (
  async (req: NextRequest, _next: NextFetchEvent) => {
    const path = req.nextUrl.pathname;
    const res = await next(req, _next) as NextResponse;
    if (!path.startsWith('/api')) return res;
    const { origin } = req.nextUrl;
    if (
      origin.startsWith('http://localhost')
      || ALLOWED_ORIGINS.some((ao) => origin.startsWith(ao))
    ) {
      res.headers.set('Access-Control-Allow-Credentials', 'true');
      res.headers.set('Access-Control-Allow-Origin', origin);
      res.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
      res.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
      return res;
    }

    return res;
  }
);

export default withOriginMiddleware;
