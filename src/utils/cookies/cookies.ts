const addDays = (days: number) => new Date(new Date().getTime() + (days * 1000 * 60 * 60 * 24));

export const setCookie = (name: string, value: string, options?: {expDays?: number, path?: string}) => {
  document.cookie = `${name}=${value};${
    typeof options?.expDays === 'number'
      ? `expires=${addDays(options.expDays)};`
      : ''
  }path=${options?.path || '/'}`;
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

  return cookie?.split('=')[1];
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=${new Date(0)};path=/`;
};
