'use client';

import LogInIcon from '@icons/log-in.svg';
import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import MainMenuBtn from './MenuBtn';
import modalStore from '../../store/modal/modalStore';
import { useNextAuth } from '../../hooks/Auth/useAuth';

const MainMenuLogIn = () => {
  const { isAuthenticated } = useNextAuth();
  const setModalContent = modalStore((state) => state.setModalContent);
  const showModal = modalStore((state) => state.setShowModal);
  const onLogInClick = useCallback(() => {
    setModalContent({
      name: 'logIn',
      propsToChildren: { isLogin: true },
    });
    showModal(true);
  }, [setModalContent, showModal]);

  const onLogOutClick = useCallback(() => {
    signOut();
  }, []);
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
