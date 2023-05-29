'use client';

/* eslint-disable camelcase */
import Config from '@config';
import { decodeJWT } from '@utils/jwt/jwt';
import authStore from '@store/auth/authStore';
import { useDebounce } from '@hooks/React/useDebounce';
import { loadUser } from '../../Http/requests/user';
import { googleLogIn } from '../../Http/requests/auth';

const clientId = Config.get('keys').googleOAuthID;

const GoogleAuth = () => {
  const setAuthData = authStore((state) => state.setAuthData);
  const setUser = authStore((state) => state.setUser);
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  const callback: GoogleIDConfig['callback'] = async (gres) => {
    const data = decodeJWT<GAuthResponse>(gres.credential);
    const res = await googleLogIn({
      username: data.email,
    });
    if (res) {
      setAuthData(res);
      const user = await loadUser(undefined);
      if (user) setUser(user);
    }
  };

  useDebounce(() => {
    if (!isAuthenticated && window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        cancel_on_tap_outside: false,
        callback,
      });

      window.google.accounts.id.prompt();
    }
  }, [isAuthenticated], 3000);

  return null;
};

export default GoogleAuth;
