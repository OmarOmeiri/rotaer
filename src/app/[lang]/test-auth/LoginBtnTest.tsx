'use client';

import { signIn, signOut } from 'next-auth/react';
import { useNextAuth } from '../../../hooks/Auth/useAuth';
/** */
export default function LogInBtnTest() {
  const session = useNextAuth();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.username} <br />
        <button onClick={() => signOut({ redirect: false })}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn('credentials', { redirect: false, email: '', password: '' })}>Sign in</button>
    </>
  );
}
