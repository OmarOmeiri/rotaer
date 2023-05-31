import {
  NextResponse,
  NextFetchEvent,
  NextRequest,
  NextMiddleware,
} from 'next/server';

import { MiddlewareFactory } from './types';

const withTokenMiddleware: MiddlewareFactory = (next: NextMiddleware) => (
  async (req: NextRequest, _next: NextFetchEvent) => {
    // const path = req.nextUrl.pathname;
    // console.log('path: ', path);
    // console.log(req.cookies.getAll());
    // console.log('<><><><><><><><><><><><><><><><>');
    const res = await next(req, _next) as NextResponse;

    return res;
  }
);

export default withTokenMiddleware;
