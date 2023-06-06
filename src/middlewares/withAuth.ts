import {
  NextResponse,
  NextFetchEvent,
  NextRequest,
  NextMiddleware,
} from 'next/server';
import { getSession } from 'next-auth/react';
import { MiddlewareFactory } from './types';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

const withAuthMiddleware: MiddlewareFactory = (next: NextMiddleware) => (
  async (req: NextRequest, _next: NextFetchEvent) => {
    const res = await next(req, _next) as NextResponse;
    return res;
  }
);

export default withAuthMiddleware;
