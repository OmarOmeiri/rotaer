import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { ErrorCodes } from 'lullo-common-types';
import { cloneDeep } from 'lodash';
import { objHasProp } from 'lullo-utils/Objects';
import { omitFromObjArray } from 'lullo-utils/Arrays';
import { ClientError } from '../../utils/Errors/ClientError';
import { IInput } from '../../components/Forms/typings';
import { useSyncStateRef } from '../React/useSyncStateRef';
import warnHelper from '../../utils/Errors/warnHelper';
import { getZodErrorMessage } from '../../frameworks/zod/zodError';

type Validators<F extends IFormData<false>> = {[K in keyof F]: (value: F[K], formData: F) => any}

type useFormProps<F extends IFormData<false>, V extends Validators<F>> = {
  formData: F
  attrName?: string,
  validation?: V
  inputs: IInput[]
  validateOnBlur?: boolean,
}

export type ParsedForms<F extends IFormData<false>, V extends Validators<F>> = {
  [K in keyof V]: ReturnType<V[K]>
}

export const useForms = <F extends IFormData<false>, V extends Validators<F>>({
  formData,
  attrName = 'data-name',
  validation,
  validateOnBlur,
  inputs,
}: useFormProps<F, V>) => {
  const [_formData, setFormData] = useState<F>(formData);
  const [_inputs, _setInputs] = useSyncStateRef({ value: inputs });

  const setInputValidationResult = useCallback((k: keyof F, val: Partial<IInput>) => {
    _setInputs(
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
  }, [_setInputs, _inputs]);

  const onBlur = useCallback((e: React.FocusEvent) => {
    if (!validation) {
      warnHelper({ message: 'The parse function needs the validation object', stack: new Error().stack });
      return;
    }
    if (!validateOnBlur) return;
    const target = e.target as HTMLInputElement;
    const id = target.getAttribute(attrName);
    if (!id) {
      throw new ClientError('Form input attribute not found', {
        code: ErrorCodes.htmlAttrError,
        silent: true,
        save: true,
        stack: new Error().stack,
      });
    }
    if (objHasProp(validation, [id])) {
      try {
        const validationFn = validation[id];
        const formValue = _formData[id];
        const res = validationFn(formValue as F[string], _formData);
        setInputValidationResult(id, { valid: true, validationMsg: null });
      } catch (error) {
        setInputValidationResult(id, {
          valid: false,
          validationMsg: getZodErrorMessage(error),
        });
      }
    }
  }, [
    validateOnBlur,
    attrName,
    validation,
    _formData,
    setInputValidationResult,
  ]);

  const inputsWithValue: IInput[] = useMemo(() => (
    _inputs.current.map((i) => ({
      ...i,
      value: _formData[i.name],
      onBlur,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [_formData, omitFromObjArray(_inputs.current, ['labelSideComponent'])]);

  useEffect(() => {
    if (formData) setFormData(formData);
  }, [formData]);
  useEffect(() => {
    if (inputs) _setInputs(inputs);
  }, [inputs, _setInputs]);

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

  const isFormsValid = useCallback((keys?: TypeOrArrayOfType<keyof F>) => {
    if (!keys) return _inputs.current.every((i) => i.valid === true || i.valid === null);
    return [keys].flat().every((k) => {
      const isValid = _inputs.current.find((i) => i.name === k)?.valid;
      return isValid === true || isValid === null;
    });
  }, [_inputs]);

  const parse = useCallback(() => {
    if (!validation) warnHelper({ message: 'The parse function needs the validation object', stack: new Error().stack });
    const parsed: ParsedForms<F, V> = {} as ParsedForms<F, V>;
    const keys = Object.keys(_formData);
    for (const key of keys) {
      if (objHasProp(validation, [key])) {
        try {
          const validationFn = validation[key];
          const formValue = _formData[key];
          const parsedValue = validationFn(formValue as F[string], _formData);
          parsed[key as keyof typeof parsed] = parsedValue;
        } catch {}
      }
    }
    return {
      ...cloneDeep(_formData),
      ...parsed,
    } as unknown as Expand<OverWrite<typeof _formData, typeof parsed>>;
  }, [_formData, validation]);

  const validate = useCallback((keysToValidate?: TypeOrArrayOfType<keyof F>) => {
    if (!validation) warnHelper({ message: 'The parse function needs the validation object', stack: new Error().stack });
    const parsed: ParsedForms<F, V> = {} as ParsedForms<F, V>;
    const keys = (keysToValidate
      ? [keysToValidate].flat()
      : Object.keys(_formData)) as string[];
    for (const key of keys) {
      if (objHasProp(validation, [key])) {
        try {
          const validationFn = validation[key];
          const formValue = _formData[key];
          const parsedValue = validationFn(formValue as F[string], _formData);
          parsed[key as keyof typeof parsed] = parsedValue;
          setInputValidationResult(key, { valid: true, validationMsg: null });
        } catch (error) {
          setInputValidationResult(key, {
            valid: false,
            validationMsg: getZodErrorMessage(error),
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

  const setInputs = useCallback((fn: (i: IInput[]) => IInput[]) => {
    _setInputs(fn(_inputs.current));
  }, [_inputs, _setInputs]);

  const manualFormDataChange = useCallback((fn: (fd: F) => {[K: string]: any}) => {
    setFormData((fd) => {
      const newValues = cloneDeep(fn(fd));
      return (
      Object.fromEntries(
        Object.keys(fd).map((k) => {
          const newValue = newValues[k];
          if (typeof newValue === 'undefined') return [k, ''];
          return [k, String(newValue)];
        }),
      ) as F
      );
    });
  }, []);

  return {
    inputs: inputsWithValue,
    formData: _formData,
    parse,
    manualFormDataChange,
    setFormData,
    setInputs,
    onChange,
    isFormsValid,
    validate,
  };
};
