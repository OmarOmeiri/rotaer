import { cloneDeep } from 'lodash';
/* eslint-disable require-jsdoc */
import { ErrorCodes } from 'lullo-common-types';
import React, {
  useCallback,
  useState,
} from 'react';
import z from 'zod';
import { IInput } from '@/components/Forms/typings';
import {
  IForms,
  IValidate,
  ValidationFunc,
} from '@/types/app/forms/formValidation';
import { ClientError } from '@/utils/Errors/ClientError';
import { useSyncStateRef } from '../React/useSyncStateRef';

type ValidateAll<
  FD extends IFormData<true>,
  V extends IValidate<FD>,
> = () => Expand<OverWrite<FD, { [k in keyof V]: ReturnType<Exclude<V[k], undefined>>; }>>

type CustomValidate<FD extends IFormData<true>> = {[K in keyof FD]?: {
  func: (formData: FD) => boolean,
  message: string,
}}

const setFormValidationResult = <FD extends IFormData<true>>(
  forms: IForms<FD>[],
  key: keyof FD,
  props: Pick<IForms<FD>, 'valid' | 'validationMsg'>,
) => {
  const index = forms.findIndex((f) => f.name === key);
  if (index < 0) {
    throw new ClientError('Houve um erro ao validar os formulários', {
      code: ErrorCodes.notFoundError,
      stack: new Error().stack,
      data: {
        reason: 'Forms array did not contain the given key.',
        key,
      },
    });
  }
  forms[index] = { ...forms[index], ...props };
};

export function useFormData<
  FD extends IFormData<true>,
  F extends IForms<FD>,
  V extends IValidate<FD>,
>(params:{
  initFormData?: undefined,
  initForms: F[],
  validate?: V
  customValidate?: undefined,
  formAttr?: string
}): {
  formData: undefined,
  forms: React.MutableRefObject<F[]>,
  setForms: (newState: F[]) => void
  isAllValid: () => boolean,
  validateAll: ValidateAll<FD, V>,
  onChange: React.ChangeEventHandler
  validateOnBlur: React.FocusEventHandler,
  setFormData: React.Dispatch<React.SetStateAction<undefined>>
}
export function useFormData<
  FD extends IFormData<true>,
  F extends IForms<FD>,
  V extends IValidate<FD>,
>(params:{
  initFormData: FD,
  initForms: F[],
  validate?: V
  customValidate?: CustomValidate<FD>
  formAttr?: string
}): {
  formData: FD,
  forms: React.MutableRefObject<(F)[]>,
  setForms: (newState: F[]) => void
  isAllValid: () => boolean,
  validateAll: ValidateAll<FD, V>,
  onChange: React.ChangeEventHandler
  validateOnBlur: React.FocusEventHandler,
  setFormData: React.Dispatch<React.SetStateAction<FD>>
}
export function useFormData<
  FD extends IFormData<true>,
  F extends IForms<FD>,
  V extends IValidate<FD>,
>({
  initFormData,
  validate,
  initForms,
  customValidate,
  formAttr = 'data-name',
}:{
  initFormData?: FD,
  initForms: F[],
  validate?: V
  customValidate?: CustomValidate<FD>,
  formAttr?: string
}): {
  formData: FD | undefined,
  forms: React.MutableRefObject<F[]>,
  setForms: (newState: F[]) => void
  isAllValid: () => boolean,
  validateAll: ValidateAll<FD, V>,
  onChange: React.ChangeEventHandler
  validateOnBlur: React.FocusEventHandler,
  setFormData: React.Dispatch<React.SetStateAction<FD | undefined>>
} {
  const [formData, setFormData] = useState(initFormData);
  const [forms, setForms] = useSyncStateRef({ value: initForms });

  const onChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const id = target.getAttribute(formAttr);
    const { value } = target;
    if (!id) {
      throw new ClientError('Form input id attribute not found', {
        code: ErrorCodes.htmlAttrError,
        silent: true,
        save: true,
        stack: new Error().stack,
      });
    }
    setFormData((state) => ({
      ...state,
      [id]: value,
    } as FD));
  }, []);

  const validateFn = (
    value: string | string[],
    fn: ValidationFunc,
  ) => {
    try {
      const parsed = fn(value as any, z);
      return {
        parsed,
        valid: true,
        validationMsg: undefined,
      };
    } catch (error) {
      let msg = '';
      if (error instanceof z.ZodError) {
        msg = error.issues[0].message;
      } else {
        msg = error.message;
      }
      return {
        parsed: undefined,
        valid: false,
        validationMsg: msg,
      };
    }
  };

  const isAllValid = useCallback(() => forms
    .current
    .filter((f) => f.display !== false)
    .every((f) => f.valid === true), [forms]);

  const _customValidate = useCallback((formsCopy: F[], fData: FD) => {
    for (const k of Object.keys(fData)) {
      const customVal = customValidate?.[k];
      if (customVal) {
        const { func, message } = customVal;

        if (func(fData)) {
          setFormValidationResult(formsCopy, k as keyof FD, {
            valid: true,
            validationMsg: undefined,
          });
          continue;
        }
        setFormValidationResult(formsCopy, k as keyof FD, {
          valid: false,
          validationMsg: message,
        });
      }
      //  else {
      //   setFormValidationResult(formsCopy, k as keyof FD, {
      //     valid: true,
      //     validationMsg: undefined,
      //   });
      // }
    }
  }, [customValidate]);

  const validateAll = useCallback((): Expand<OverWrite<typeof formData, typeof validated>> => {
    if (!formData || !validate) {
      throw new ClientError('Houve um erro ao validar o formulário', {
        code: ErrorCodes.notFoundError,
        stack: undefined,
        data: {
          reason: 'Cannot call the `validateAll` function without providing the formData and the `validate` object.',
        },
      });
    }

    const formsCopy = cloneDeep(forms.current);
    const validated: {[k in keyof typeof validate]: ReturnType<Exclude<typeof validate[k], undefined>>} = {} as any;
    for (const [k, f] of Object.entries(validate) as Entries<typeof validate>) {
      const fn = f as ValidationFunc;
      if (!fn) continue;
      const value = formData[k as keyof typeof formData];
      const {
        parsed,
        valid,
        validationMsg,
      } = validateFn(value, fn);
      if (parsed) {
        validated[k] = parsed as ReturnType<Exclude<typeof validate[keyof typeof validate], undefined>>;
      }
      setFormValidationResult(formsCopy, k as keyof FD, {
        valid,
        validationMsg,
      });
    }

    _customValidate(formsCopy, formData);

    setForms(formsCopy);
    const parsedFormData = {
      ...formData,
      ...validated,
    } as unknown as Expand<OverWrite<typeof formData, typeof validated>>;
    return parsedFormData;
  }, [
    _customValidate,
    formData,
    forms,
    setForms,
    validate,
  ]);

  const _validateOnBlur = useCallback((key: string, value: string | string[], validate: IValidate<FD>) => {
    const validationFunc = validate[key];
    if (!validationFunc) {
      throw new ClientError('Houve um erro ao validar o formulário', {
        code: ErrorCodes.notFoundError,
        stack: undefined,
        data: {
          reason: 'Cannot call the `validateOnBlur` function without providing the validation function.',
          key,
        },
      });
    }
    const formsCopy = cloneDeep(forms.current);
    const {
      valid,
      validationMsg,
    } = validateFn(value, validationFunc as ValidationFunc);

    setFormValidationResult(formsCopy, key as keyof FD, {
      valid,
      validationMsg,
    });
    setForms(formsCopy);
  }, [forms, setForms]);

  const validateOnBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!validate) {
      throw new ClientError('Houve um erro ao validar o formulário', {
        code: ErrorCodes.notFoundError,
        stack: undefined,
        data: {
          reason: 'Cannot call the `validateOnBlur` function without providing the `validate` object.',
        },
      });
    }
    const target = e.target as HTMLInputElement;
    const key = target.getAttribute(formAttr);
    const { value } = target;
    if (!key) {
      throw new ClientError('Houve um erro ao validar o formulário', {
        code: ErrorCodes.notFoundError,
        stack: undefined,
        data: {
          reason: 'Form key not found',
        },
      });
    }
    if (!formData) {
      return _validateOnBlur(key, value, validate);
    }
    if (!(key in formData)) {
      throw new ClientError('Houve um erro ao validar o formulário', {
        code: ErrorCodes.notFoundError,
        stack: undefined,
        data: {
          reason: 'Form key not found',
        },
      });
    }
    return _validateOnBlur(key, formData[key], validate);
  }, [
    _validateOnBlur,
    formAttr,
    formData,
    validate,
  ]);

  return {
    formData,
    forms,
    setForms: setForms as (newState: (F | IInput)[]) => void,
    onChange,
    isAllValid,
    validateAll,
    validateOnBlur,
    setFormData,
  };
}

