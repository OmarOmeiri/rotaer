'use client';

/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import authStore from '@store/auth/authStore';
import { shallow } from 'zustand/shallow';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { loadUser } from '../../Http/requests/user';
import alertStore from '../../store/alert/alertStore';

const Auth = () => {
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const setAlert = alertStore((state) => state.setAlert);
  const queryClient = useQueryClient();
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

  const query = useQuery({
    queryKey: ['user', 'load'],
    queryFn: () => {
      try {
        return loadUser(undefined);
      } catch {
        logOut();
        return null;
      }
    },
    enabled,
    cacheTime: 0,
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
      queryClient.invalidateQueries({ queryKey: ['user', 'load'] });
      setEnabled(true);
      return;
    }
    if (isAuthenticated) {
      setEnabled(false);
      return;
    }
    if (!token) {
      queryClient.invalidateQueries({ queryKey: ['user', 'load'] });
      setEnabled(false);
    }
  }, [isAuthenticated, token, reloading, queryClient]);

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
    if (query.data && token) {
      setUser(query.data);
      setAlert({ msg: `Bem vindo ${query.data.username.split('@')[0]}`, type: 'success' });
    }
  }, [
    query.data,
    isAuthenticated,
    token,
    setUser,
    initToken,
    setAlert,
    logOut,
  ]);

  return null;
};

export default Auth;
