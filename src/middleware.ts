import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://www.rotaer.com',
];

const checkOrigin = (req: NextRequest): Record<string, string> => {
  const { origin } = req.nextUrl;
  if (
    origin.startsWith('http://localhost')
    || ALLOWED_ORIGINS.some((ao) => origin.startsWith(ao))
  ) {
    return {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    };
  }
  return {};
};

export const middleware = (req: NextRequest) => {
  const originHeaders = checkOrigin(req);
  return NextResponse.next({ headers: { ...originHeaders } });
};

export const config = {
  matcher: '/api/:path*',
};
