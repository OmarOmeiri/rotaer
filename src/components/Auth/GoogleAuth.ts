'use client';

/* eslint-disable camelcase */
import Config from '@config';
import { decodeJWT } from '@utils/jwt/jwt';
import authStore from '@store/auth/authStore';
import { useDebounce } from '@hooks/React/useDebounce';
import { googleLogIn, loadUser } from '../../Http/requests/user';

type Props = {
  isAuthenticated: boolean
}

const clientId = Config.get('keys').googleOAuthID;

const GoogleAuth = ({ isAuthenticated }: Props) => {
  const setAuthData = authStore((state) => state.setAuthData);
  const setUser = authStore((state) => state.setUser);

  const callback: GoogleIDConfig['callback'] = async (gres) => {
    const data = decodeJWT<GAuthResponse>(gres.credential);
    const res = await googleLogIn({
      email: data.email,
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
