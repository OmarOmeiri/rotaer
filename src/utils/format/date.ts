export const formatDate = (
  date: Date,
  locale: string = typeof document !== 'undefined' ? document.documentElement.lang : 'pt-BR',
) => {
  if (locale === 'en-US') {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
