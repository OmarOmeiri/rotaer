'use client';

import LogInIcon from '@icons/log-in.svg';
import { useCallback } from 'react';
import authStore from '../../store/auth/authStore';
import MainMenuBtn from './MenuBtn';
import modalStore from '../../store/modal/modalStore';

const MainMenuLogIn = () => {
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const logOut = authStore((state) => state.logOut);
  const setModalContent = modalStore((state) => state.setModalContent);
  const showModal = modalStore((state) => state.setShowModal);
  const onLogInClick = useCallback(() => {
    setModalContent({
      name: 'logIn',
      propsToChildren: null,
    });
    showModal(true);
  }, [setModalContent, showModal]);

  const onLogOutClick = useCallback(() => {
    logOut();
  }, [logOut]);
  return (
    isAuthenticated
      ? (
        <MainMenuBtn icon={<LogInIcon/>} onClick={onLogOutClick}>
          Log out
        </MainMenuBtn>
      )
      : (
        <MainMenuBtn icon={<LogInIcon/>} onClick={onLogInClick}>
          Log in
        </MainMenuBtn>
      )
  );
};

export default MainMenuLogIn;
