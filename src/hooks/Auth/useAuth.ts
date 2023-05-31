import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export const useNextAuth = () => {
  const session = useSession();

  const isAuthenticated = session.status === 'authenticated';
  const isLoading = session.status === 'loading';
  const expires = session.data?.expires || null;
  const user = useMemo(() => session.data?.user || null, [session.data?.user]);
  return {
    isAuthenticated,
    isLoading,
    user,
    expires,
  };
};
