import { cookies } from 'next/headers';

/** */
export async function setServerSideCookie(key: string, value: string) {
  'use server';

  cookies().set({
    name: key,
    value,
  });
}
