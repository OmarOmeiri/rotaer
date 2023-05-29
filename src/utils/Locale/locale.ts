import { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export const locales: Langs[] = ['en-US', 'pt-BR'];
export const defaultLocale = 'pt-BR';

export const checkLocale = (value: unknown): Langs => {
  if (typeof value !== 'string') return defaultLocale;
  if (locales.includes(value as Langs)) return value as Langs;
  return defaultLocale;
};

export const isMissingLocale = (path: string) => (
  locales.every(
    (locale) => !path.startsWith(`/${locale}/`) && path !== `/${locale}`,
  )
);

export const getLocale = (req: NextRequest) => {
  const languages = new Negotiator({
    headers: {
      'accept-language': req.headers.get('accept-language') || '',
    },
  }).languages();
  return match(languages, locales, defaultLocale);
};
