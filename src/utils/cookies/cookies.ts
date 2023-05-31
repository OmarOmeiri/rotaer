import { isDate } from 'lullo-utils/Date';

type SetCookieOptions = {
  expAt?: Date | string,
  path?: string
}

const writeCookie = (name: string, value: string, options?: SetCookieOptions) => {
  const { expAt, path } = options || {};
  let exp: string | undefined;
  if (isDate(expAt)) exp = expAt.toISOString();
  else if (expAt) exp = expAt;
  return (
    `${name}=${value};${
      exp
        ? `expires=${exp};`
        : ''
    }path=${path || '/'}`
  );
};

export const setCookie = (name: string, value: string, options?: SetCookieOptions) => {
  const ck = writeCookie(name, value, options);
  document.cookie = ck;
};

export const getCookies = () => (
  decodeURIComponent(document.cookie)
    .split(';')
    .reduce((cObj, ck) => {
      const [k, v] = ck.split('=');
      cObj[k.trim()] = v;
      return cObj;
    }, {} as Record<string, string>)
);

export const getCookie = (name: string) => {
  const cookie = decodeURIComponent(document.cookie)
    .split(';')
    .find((c) => c.split('=')[0].trim() === name);

  return cookie?.split('=')[1] || null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=${new Date(0)};path=/`;
};
