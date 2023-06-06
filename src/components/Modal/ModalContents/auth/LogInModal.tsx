import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Config from '@config';
import LogoSm from '@assets/icons/rotaer_icon.svg';
import Input, { IInput, inputTypes } from '@components/Forms/Input';
import { zodPasswordValidator, zodUserNameValidator } from '@frameworks/zod/zodValidators';
import { shallow } from 'zustand/shallow';
import {
  signIn, signOut, SignInResponse,
} from 'next-auth/react';
import classes from './AuthModal.module.css';
import { GoogleLoginBtn } from '../../../Buttons/GoogleLogin/GoogleLoginBtn';
import modalStore from '../../../../store/modal/modalStore';
import Translator from '../../../../utils/Translate/Translator';
import { createUser } from '../../../../Http/requests/user';
import { useForms } from '../../../../hooks/Forms/useForm';
import ModalEnterBtn from '../ModalEnterBtn';
import alertStore from '../../../../store/alert/alertStore';
import { useNextAuth } from '../../../../hooks/Auth/useAuth';

type Props = {
  isLogin?: boolean
}

const styles = Config.get('styles');

const translator = new Translator({
  password: { 'pt-BR': 'Senha', 'en-US': 'Password' },
  passwdConfirm: { 'en-US': 'Confirm password', 'pt-BR': 'Confirma senha' },
  signUp: { 'en-US': 'Sign Up', 'pt-BR': 'Cadastro' },
  enter: { 'en-US': 'Enter', 'pt-BR': 'Entrar' },
  username: { 'en-US': 'Username', 'pt-BR': 'Usuário' },
  forgotPasswd: { 'en-US': 'Forgot?', 'pt-BR': 'Esqueceu?' },
  nonMatchingPassword: { 'en-US': 'The passwords do not match', 'pt-BR': 'As senhas não são iguais' },
  loginSuccess: { 'en-US': 'Welcome', 'pt-BR': 'Bem vindo' },
  loginFail: { 'en-US': 'There was an error logging you in.', 'pt-BR': 'Houve um erro ao logar' },
});

const initFormData = {
  username: '',
  password: '',
  passwordConfirm: '',
};

const initForms: IInput[] = [
  {
    id: 'auth-username',
    type: inputTypes.email as const,
    name: 'username' as const,
    label: translator.translate('username'),
  },
  {
    id: 'auth-password',
    type: inputTypes.password as const,
    name: 'password' as const,
    label: translator.translate('password'),
  },
  {
    id: 'auth-confirm-password',
    type: inputTypes.password as const,
    name: 'passwordConfirm' as const,
    label: translator.translate('passwdConfirm'),
    display: false,
  },
];

const StyledTitle = styled.div`
  color: ${styles.colors.lightGrey};
  border-bottom: 1px solid ${styles.colors.grey};`;

const labelStyle = {
  color: styles.colors.lightGrey,
  fontSize: '0.9rem',
  maxWidth: '265px',
};

const inputStyle = (type?: inputTypes): React.CSSProperties | undefined => {
  if (type === inputTypes.password) {
    return {
      fontSize: '1.3rem',
    };
  }
};

const labelInnerStyle = (name: typeof initForms[number]['name']): React.CSSProperties | undefined => {
  const base = { maxHeight: '45px' };
  if (name === 'password') {
    return {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      ...base,
    };
  }
  return base;
};

const labelSideComponent = (
  name: typeof initForms[number]['name'],
  onForgotPasswordClick: React.MouseEventHandler,
) => {
  if (name === 'password') {
    return (
      <div style={{ textAlign: 'end' }}>
        <button className={classes.TextBtn} type="button" onClick={onForgotPasswordClick}>
          {translator.translate('forgotPasswd')}
        </button>
      </div>
    );
  }
};

const validators = {
  username: (value: string) => (
    zodUserNameValidator(value)
  ),
  password: (value: string) => (
    zodPasswordValidator(value)
  ),
  passwordConfirm: (value: string, fd: typeof initFormData) => {
    if (value === fd.password) {
      return value;
    }
    throw new Error(translator.translate('nonMatchingPassword'));
  },
};

const LogInModal = ({ isLogin }: Props) => {
  const [isLogIn, setIsLogIn] = useState(isLogin !== false);
  const [loading, setLoading] = useState(false);
  const setAlert = alertStore((state) => state.setAlert);
  const session = useNextAuth();
  const { closeModal, setModalContent } = modalStore((state) => ({
    closeModal: state.closeModal,
    setModalContent: state.setModalContent,
  }), shallow);
  const {
    onChange,
    inputs,
    setInputs,
    validate,
    isFormsValid,
  } = useForms({
    formData: initFormData,
    inputs: initForms,
    validation: validators,
  });

  const changeFormVisibility = useCallback((state: IInput[], display: boolean) => state.reduce((st, f) => {
    if (f.name === 'passwordConfirm') {
      return [
        ...st,
        {
          ...f,
          display,
        },
      ];
    }
    return [...st, f];
  }, [] as IInput[]), []);

  useEffect(() => {
    if (!isLogIn) {
      setInputs((i) => changeFormVisibility(i, true));
    } else {
      setInputs((i) => changeFormVisibility(i, false));
    }
  }, [isLogIn, changeFormVisibility, inputs, setInputs]);

  useEffect(() => {
    if (
      session.isAuthenticated
      && !session.isLoading
      && session.user?.username
    ) {
      closeModal();
      setAlert({ msg: `${translator.translate('loginSuccess')} ${session.user.username.split('@')[0]}`, type: 'success' });
    }
  }, [session.isAuthenticated, session.isLoading, session.user, setAlert, closeModal]);

  const changeToSignUp = () => {
    setIsLogIn(false);
  };

  const onLogIn = useCallback((res: SignInResponse | undefined) => {
    if (res?.error || !res) {
      setAlert({ msg: res?.error || translator.translate('loginFail'), type: 'error' });
    }
  }, [setAlert]);

  const logIn = useCallback(async ({ username, password }: {
    username: string,
    password: string
  }) => {
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
    onLogIn(res);
    setLoading(false);
  }, [onLogIn]);

  const create = useCallback(async ({ username, password }: {
    username: string,
    password: string
  }) => {
    setLoading(true);
    const res = await createUser({
      password,
      username,
    });
    if (res) logIn({ username, password });
    else setLoading(false);
  }, [logIn]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const parsed = validate();
    try {
      if (isLogIn && isFormsValid(['username', 'password'])) {
        logIn(parsed);
      } else if (isFormsValid()) {
        create(parsed);
      }
    } catch (error) {
      signOut();
      setLoading(false);
    }
  };

  const onForgotPasswordClick = () => {
    setModalContent({
      name: 'forgotPassword',
      propsToChildren: undefined,
    });
  };

  return (
    <>
      <LogoSm style={{
        position: 'absolute',
        opacity: '0.05',
        left: 'calc(25%)',
        top: 'calc(25%)',
        width: '50%',
      }}/>
      <div className={classes.Wrapper}>
        <StyledTitle className={classes.Title}>
          {isLogIn ? 'Log in' : translator.translate('signUp')}
        </StyledTitle>
        <div className={classes.Contents}>
          <form className={classes.Form} onSubmit={onSubmit}>
            {
              inputs.map((f) => (
                <Input
                  key={f.name}
                  {...f as IInput}
                  inputStyle={inputStyle(f.type)}
                  onChange={onChange}
                  styleType='transparent'
                  labelStyle={labelStyle}
                  labelSideComponent={labelSideComponent(f.name, onForgotPasswordClick)}
                  labelInnerStyle={labelInnerStyle(f.name)}
                  wrapperClassName={classes.InputWrapper}
                />
              ))
            }
            <ModalEnterBtn type='submit' onClick={onSubmit} loading={loading}>
              {translator.translate('enter')}
            </ModalEnterBtn>
          </form>
          {
            isLogIn ? (
              <div>
                <div style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '1em',
                }}>
                  <GoogleLoginBtn/>
                </div>
                <div style={{
                  color: styles.colors.lightGrey,
                  fontSize: '0.8rem',
                  marginTop: '20px',
                  width: '100%',
                  padding: '0 1em',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                  <button type='button' className={classes.TextBtn} onClick={changeToSignUp}>
                    {translator.translate('signUp')}
                  </button>
                </div>
              </div>
            ) : null
          }
        </div>
      </div>
    </>
  );
};

export default LogInModal;

