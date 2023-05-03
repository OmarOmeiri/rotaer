export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions & {locale?: string} = {
    dateStyle: 'short',
    timeStyle: 'short',
    locale: typeof document !== 'undefined' ? document.documentElement.lang : 'pt-BR',
  },
) => new Intl.DateTimeFormat(options.locale, options).format(date);
