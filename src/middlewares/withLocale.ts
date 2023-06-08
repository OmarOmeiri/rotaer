import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server';
import { MiddlewareFactory } from './types';
import {
  getLocale,
  isMissingLocale,
} from '../utils/Locale/locale';

const pathMatch = (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  if (path.startsWith('/_next')) return false;
  if (path.startsWith('/api')) return false;
  if (/^\/.*\..+/.test(path)) { // PUBLIC folder
    // if (process.env.NODE_ENV === 'development') console.info(req.nextUrl);
    return false;
  }
  return true;
};

const withLocaleMiddleware: MiddlewareFactory = (next: NextMiddleware) => (
  async (req: NextRequest, _next: NextFetchEvent) => {
    const path = req.nextUrl.pathname;
    const res = await next(req, _next) as NextResponse;
    if (pathMatch(req)) {
      const pathWithSearchParams = `${path}${req.nextUrl.search}`;

      // if (hasDoubleLocale(path)) {

      // }

      const pathnameIsMissingLocale = isMissingLocale(path);

      if (pathnameIsMissingLocale) {
        const locale = getLocale(req);
        return NextResponse.redirect(
          new URL(`/${locale}/${pathWithSearchParams.replace(/^\/*/, '')}`, req.url).toString(),
        );
      }
    }
    return res;
  }
);

export default withLocaleMiddleware;
