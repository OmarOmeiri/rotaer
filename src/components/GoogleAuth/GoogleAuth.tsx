'use client';

/* eslint-disable camelcase */
import Config from '@config';
import { decodeJWT } from '@utils/jwt/jwt';
import { useDebounce } from '@hooks/React/useDebounce';
import { SignInResponse, signIn } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { useNextAuth } from '../../hooks/Auth/useAuth';
import Translator from '../../utils/Translate/Translator';
import alertStore from '../../store/alert/alertStore';

const clientId = Config.get('keys').googleOAuthID;

const translator = new Translator({
  unverifiedEmail: { 'pt-BR': 'Email precisa estar verificado no Google', 'en-US': 'Your Google email is not verified' },
  loginFail: { 'en-US': 'There was an error logging you in.', 'pt-BR': 'Houve um erro ao logar' },
  loginSuccess: { 'en-US': 'Welcome', 'pt-BR': 'Bem vindo' },
});

const GoogleAuth = () => {
  const { isAuthenticated, isLoading, user } = useNextAuth();
  const setAlert = alertStore((state) => state.setAlert);

  useEffect(() => {
    if (
      isAuthenticated
      && !isLoading
      && user?.username
    ) {
      setAlert({ msg: `${translator.translate('loginSuccess')} ${user.username.split('@')[0]}`, type: 'success' });
    }
  }, [isAuthenticated, isLoading, user, setAlert]);

  const onLogIn = useCallback((res: SignInResponse | undefined) => {
    if (res?.error || !res) {
      setAlert({ msg: res?.error || translator.translate('loginFail'), type: 'error' });
    }
  }, [setAlert]);

  const callback: GoogleIDConfig['callback'] = async (gres) => {
    const data = decodeJWT<GAuthResponse>(gres.credential);
    if (!data.email_verified) {
      setAlert({ msg: translator.translate('unverifiedEmail'), type: 'error' });
      return;
    }
    const res = await signIn('credentials', {
      redirect: false,
      username: data.email,
      isGoogle: true,
    });
    onLogIn(res);
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

  useEffect(() => {
    const googleLogInPrompt = document.getElementById('credential_picker_container');
    if (isAuthenticated && googleLogInPrompt) {
      googleLogInPrompt.style.display = 'none';
    } else if (googleLogInPrompt) {
      googleLogInPrompt.style.removeProperty('display');
    }
  }, [isAuthenticated]);

  return null;
};

export default GoogleAuth;
