/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import authStore from '@store/auth/authStore';
import { shallow } from '@frameworks/zustand';
import { useApiQuery } from '../../hooks/Data/useAPIQuery';

type Props = {
  isAuthenticated: boolean
}

const Auth = ({ isAuthenticated }: Props) => {
  const {
    reloading,
    token,
    setUser,
    initToken,
    logOut,
  } = authStore((state) => ({
    reloading: state.reloading,
    token: state.token,
    setUser: state.setUser,
    initToken: state.initToken,
    logOut: state.logOut,
  }), shallow);
  const [enabled, setEnabled] = useState(false);

  const { query, invalidate } = useApiQuery({
    key: 'user',
    method: 'loadUser',
    options: {
      enabled,
      cacheTime: 8.64e+7,
      staleTime: 8.64e+7,
    },
  });

  useEffect(() => {
    if (query.isError) {
      logOut();
    }
  }, [query.isError, logOut]);

  useEffect(() => {
    if (!isAuthenticated && token) {
      setEnabled(true);
      return;
    }
    if (reloading && token && isAuthenticated) {
      invalidate();
      setEnabled(true);
      return;
    }
    if (isAuthenticated) {
      setEnabled(false);
      return;
    }
    if (!token) {
      invalidate();
      setEnabled(false);
    }
  }, [isAuthenticated, token, reloading, invalidate]);

  useEffect(() => {
    if (isAuthenticated) {
      const googlePrompt = document.getElementById('credential_picker_container');
      if (googlePrompt) {
        googlePrompt.remove();
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    initToken();
    if (query.data) setUser(query.data);
  }, [query.data, setUser, initToken]);

  return null;
};

export default Auth;
