import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { ErrorCodes } from 'lullo-common-types';
import { cloneDeep } from 'lodash';
import { objHasProp } from 'lullo-utils/Objects';
import { ZodError } from 'zod';
import { ClientError } from '../../utils/Errors/ClientError';
import { IInput } from '../../components/Forms/typings';
import Translator from '../../utils/Translate/Translator';
import { useSyncStateRef } from '../React/useSyncStateRef';

type Validators<F extends IFormData<false>> = {[K in keyof F]: (value: F[K], formData: F) => any}

type useFormProps<F extends IFormData<false>, V extends Validators<F>> = {
  formData: F
  attrName?: string,
  validation?: V
  inputs: IInput[]
}

type ParsedForms<F extends IFormData<false>, V extends Validators<F>> = {
  [K in keyof V]: ReturnType<V[K]>
}

const translator = new Translator({
  genericInvalid: { 'en-US': 'Invalid value', 'pt-BR': 'Valor inválido' },
});

export const useForms = <F extends IFormData<false>, V extends Validators<F>>({
  formData,
  attrName = 'data-name',
  validation,
  inputs,
}: useFormProps<F, V>) => {
  const [_formData, setFormData] = useState<F>(formData);
  const [_inputs, setInputs] = useSyncStateRef({ value: inputs });
  const inputsWithValue: IInput[] = useMemo(() => (
    _inputs.current.map((i) => ({ ...i, value: _formData[i.name] }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [_formData, JSON.stringify(_inputs.current)]);

  useEffect(() => {
    if (formData) setFormData(formData);
  }, [formData]);
  useEffect(() => {
    if (inputs) setInputs(inputs);
  }, [inputs, setInputs]);

  const onChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const id = target.getAttribute(attrName);
    const { value } = target;
    if (!id) {
      throw new ClientError('Form input attribute not found', {
        code: ErrorCodes.htmlAttrError,
        silent: true,
        save: true,
        stack: new Error().stack,
      });
    }
    setFormData((state) => ({
      ...state,
      [id]: value,
    }));
  }, [attrName]);

  const setInputValidationResult = useCallback((k: keyof F, val: Partial<IInput>) => {
    setInputs(
      _inputs.current.map((i) => {
        if (i.name === k as string) {
          return {
            ...i,
            ...val,
          } as IInput;
        }
        return i;
      }),
    );
  }, [setInputs, _inputs]);

  const isFormsValid = useCallback((keys?: TypeOrArrayOfType<keyof F>) => {
    if (!keys) return _inputs.current.every((i) => i.valid === true || i.valid === null);
    return [keys].flat().every((k) => {
      const isValid = _inputs.current.find((i) => i.name === k)?.valid;
      return isValid === true || isValid === null;
    });
  }, [_inputs]);

  const validate = useCallback(() => {
    const parsed: ParsedForms<F, V> = {} as ParsedForms<F, V>;
    for (const key of Object.keys(_formData)) {
      if (objHasProp(validation, [key])) {
        try {
          const validationFn = validation[key];
          const formValue = _formData[key];
          const parsedValue = validationFn(formValue as F[string], _formData);
          parsed[key as keyof typeof parsed] = parsedValue;
          setInputValidationResult(key, { valid: true, validationMsg: null });
        } catch (error) {
          let msg = '';
          if (error instanceof ZodError) {
            msg = error.issues[0].message;
          } else {
            msg = error.message;
          }
          setInputValidationResult(key, {
            valid: false,
            validationMsg: msg || translator.translate('genericInvalid'),
          });
        }
        continue;
      }
      setInputValidationResult(key, { valid: null, validationMsg: null });
    }
    return {
      ...cloneDeep(_formData),
      ...parsed,
    } as unknown as Expand<OverWrite<typeof _formData, typeof parsed>>;
  }, [validation, _formData, setInputValidationResult]);

  return {
    inputs: inputsWithValue,
    setInputs,
    onChange,
    isFormsValid,
    validate,
  };
};
