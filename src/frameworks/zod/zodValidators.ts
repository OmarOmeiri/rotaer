/* eslint-disable camelcase */
import z from 'zod';
import { PASSWORD_VALIDATION_REGEX } from 'lullo-utils/RegEx';
import Translator from '../../utils/Translate/Translator';

const ZodPasswordValidatorConfig = {
  minLength: 8,
  uppercase: true,
  numbers: true,
  symbols: false,
};

const translator = new Translator({
  invalidEmail: { 'en-US': 'Invalid email', 'pt-BR': 'Email inválido' },
  invalidUsername: { 'en-US': 'Username must contain only alphanumeric characters and length at least 6.', 'pt-BR': 'Usuário deve conter somente caracteres alfanuméricos e no mínimo 6 caracteres.' },
  emailRequired: { 'en-US': 'Email is required', 'pt-BR': 'Email é obrigatório' },
  usernameRequired: { 'en-US': 'Username is required', 'pt-BR': 'Usuário é obrigatório' },
  invalidPasswdLng: { 'en-US': `Password must have at least ${ZodPasswordValidatorConfig.minLength} characters`, 'pt-BR': `A senha precisa ter no mínimo ${ZodPasswordValidatorConfig.minLength} caracteres` },
  invalidPasswd: { 'en-US': 'Password must have a lowercase, uppercase and at least one number', 'pt-BR': 'A senha precisa conter letras maiúsculas, minúsculas, e 1 número' },
  passwdRequired: { 'en-US': 'Password is required', 'pt-BR': 'Senha é obrigatória' },
});

export const zodEmailValidator = (value: unknown) => z.string({
  required_error: translator.translate('emailRequired'),
  invalid_type_error: translator.translate('emailRequired'),
}).email({
  message: translator.translate('invalidEmail'),
}).parse(value);

export const zodUserNameValidator = (value: unknown) => z.string({
  required_error: translator.translate('usernameRequired'),
  invalid_type_error: translator.translate('usernameRequired'),
})
  .refine((val) => {
    if (val.includes(' ')) return false;
    if (val.length < 6) return false;
    if (/[^A-Z0-9_-]/i.test(val)) return false;
    return true;
  }, { message: translator.translate('invalidUsername') })
  .parse(value);

const passwdRegExp = PASSWORD_VALIDATION_REGEX(ZodPasswordValidatorConfig);
export const zodPasswordValidator = (value: unknown) => z.string({
  required_error: translator.translate('passwdRequired'),
  invalid_type_error: translator.translate('passwdRequired'),
}).refine((val) => {
  if (val.length < ZodPasswordValidatorConfig.minLength) {
    return false;
  }
  return true;
}, {
  message: translator.translate('invalidPasswdLng'),
}).refine((val) => {
  if (!passwdRegExp.test(val)) {
    return false;
  }
  return true;
}, {
  message: translator.translate('invalidPasswd'),
}).parse(value);
