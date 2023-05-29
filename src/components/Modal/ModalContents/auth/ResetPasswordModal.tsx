import React, { useState } from 'react';
import styled from 'styled-components';
import Config from '@config';
import LogoSm from '@assets/icons/logo-sm.svg';
import Input, { IInput, inputTypes } from '@components/Forms/Input';
import { zodPasswordValidator } from '@frameworks/zod/zodValidators';
import authStore from '@store/auth/authStore';
import modalStore from '@store/modal/modalStore';
import classes from './AuthModal.module.css';
import { useForms } from '../../../../hooks/Forms/useForm';
import ModalEnterBtn from '../ModalEnterBtn';

const styles = Config.get('styles');

const initFormData = {
  password: '',
  passwordConfirm: '',
};

const initForms: IInput[] = [
  {
    id: 'auth-password',
    type: inputTypes.password as const,
    name: 'password' as const,
    label: 'Nova senha',
    inputClassName: 'noselect',
  },
  {
    id: 'auth-password',
    type: inputTypes.password as const,
    name: 'passwordConfirm' as const,
    label: 'Nova senha',
  },
];

const StyledTitle = styled.div`
  color: ${styles.colors.lightGrey};
  border-bottom: 1px solid ${styles.colors.grey};`;

const labelStyle = {
  color: styles.colors.lightGrey,
  fontSize: '0.9rem',
};

const inputStyle: React.CSSProperties = {
  fontSize: '1.3rem',
};

// const labelSideComponent = (
//   name: typeof initForms[number]['name'],
//   onForgotPasswordClick: React.MouseEventHandler,
// ) => {
//   if (name === 'passwordOld') {
//     return (
//       <div style={{ textAlign: 'end' }}>
//         <button className={classes.TextBtn} type="button" onClick={onForgotPasswordClick}>
//           Esqueceu?
//         </button>
//       </div>
//     );
//   }
// };

// const labelInnerStyle = (name: typeof initForms[number]['name']): React.CSSProperties | undefined => {
//   const base = { maxHeight: '45px' };
//   if (name === 'passwordOld') {
//     return {
//       display: 'flex',
//       width: '100%',
//       justifyContent: 'space-between',
//       ...base,
//     };
//   }
//   return base;
// };

const validators = {
  password: (value: string) => (
    zodPasswordValidator(value)
  ),
  passwordConfirm: (value: string, fd: typeof initFormData) => {
    if (value !== fd.password) return value;
    throw new Error('As senhas não coincidem.');
  },
};

const ResetPasswordModal = ({ token }:{token: string}) => {
  const [loading, setLoading] = useState(false);
  const reloadUser = authStore((state) => state.reloadUser);
  const hasPassword = authStore((state) => false) || false;// state.user?.password
  const closeModal = modalStore((state) => (state.closeModal));

  const {
    onChange,
    inputs,
    validate,
    isFormsValid: isAllValid,
  } = useForms({
    formData: initFormData,
    inputs: initForms,
    validation: validators,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const parsed = validate();
    if (isAllValid()) {
      setLoading(true);
      // await resetPassword({
      //   password: parsed.password,
      //   token,
      // });
      setLoading(false);
      closeModal();
      reloadUser();
    }
  };

  return (
    <>
      <LogoSm style={{
        position: 'absolute',
        opacity: '0.05',
        left: '0',
        width: '100%',
      }}/>
      <div className={classes.Wrapper}>
        <StyledTitle className={classes.Title}>
          {hasPassword ? 'Alterar Senha' : 'Criar Senha'}
        </StyledTitle>
        <div className={classes.Contents}>
          <form className={classes.Form} onSubmit={onSubmit}>
            {
              inputs.map((f) => (
                <Input
                key={f.name}
                {...f as IInput}
                inputStyle={inputStyle}
                onChange={onChange}
                styleType='transparent'
                labelStyle={labelStyle}
                wrapperClassName={classes.InputWrapper}
              />
              ))
            }
            <ModalEnterBtn type='submit' onClick={onSubmit} loading={loading}>
              OK
            </ModalEnterBtn>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordModal;

