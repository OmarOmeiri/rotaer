import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server';
import { MiddlewareFactory } from './types';

const locales = ['en-US', 'pt-BR'];
const defaultLocale = 'pt-BR';

const pathMatch = (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  if (path.startsWith('/_next')) return false;
  if (path.startsWith('/api')) return false;
  if (/^\/.*\..+/.test(path)) { // PUBLIC folder
    if (process.env.NODE_ENV === 'development') console.log(req.nextUrl);
    return false;
  }
  return true;
};

const getLocale = (req: NextRequest) => {
  const languages = new Negotiator({
    headers: {
      'accept-language': req.headers.get('accept-language') || '',
    },
  }).languages();
  return match(languages, locales, defaultLocale);
};

const withLocaleMiddleware: MiddlewareFactory = (next: NextMiddleware) => (
  async (req: NextRequest, _next: NextFetchEvent) => {
    const path = req.nextUrl.pathname;
    const res = await next(req, _next) as NextResponse;
    if (pathMatch(req)) {
      const pathWithSearchParams = `${path}${req.nextUrl.search}`;
      const pathnameIsMissingLocale = locales.every(
        (locale) => !path.startsWith(`/${locale}/`) && path !== `/${locale}`,
      );

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
