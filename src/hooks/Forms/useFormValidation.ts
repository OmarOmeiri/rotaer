import React, {
  useCallback, useEffect, useRef,
} from 'react';
import z, { ZodError } from 'zod';
import { useSyncStateRef } from '../React/useSyncStateRef';

type Inputs = HTMLInputElement | HTMLTextAreaElement | null
type FormRefs = Record<string, React.MutableRefObject<Inputs>>
type Forms<T extends FormRefs> = {
  [K in keyof T]: {
    valid: boolean | null,
    message: string | null,
  }
}
type ValFn = (val: string | undefined, zod: typeof z) => Primitives | Date | undefined

type ValidationObj<T extends FormRefs> = {
  [K in keyof T]?: ValFn
}

const useUncontrolledFormValidation = <T extends FormRefs, V extends ValidationObj<T>>({
  refs,
  validation,
  onBlur,
}: {
  refs: T,
  validation: V,
  onBlur?: (keyof T)[]
}) => {
  const [forms, setForms] = useSyncStateRef<Forms<T>>({
    value: Object.fromEntries(
      Object.keys(refs)
        .map((k) => ([k, { valid: null, message: null }])),
    ) as Forms<T>,
  });
  const parsedFormData = useRef<{[K in keyof T]: any}>({} as any);

  const onInputBlur = useCallback((e: FocusEvent, key: keyof T) => {
    const target = e.target as Inputs;
    if (target) {
      const { value } = target;
      const valFn = validation[key];
      if (!valFn) {
        setForms({
          ...forms.current,
          [key]: { valid: true, message: null },
        });
        return;
      }
      try {
        const parsed = (valFn as ValFn)(value, z);
        parsedFormData.current[key] = parsed;
        setForms({
          ...forms.current,
          [key]: { valid: true, message: null },
        });
      } catch (error) {
        let msg = error.message;
        if (error instanceof ZodError) {
          msg = error.issues[0].message;
        }
        setForms({
          ...forms.current,
          [key]: { valid: false, message: msg },
        });
      }
    }
  }, [validation, forms, setForms]);

  useEffect(() => {
    if (onBlur?.length) {
      for (const key of onBlur) {
        const elem = refs[key].current;
        if (elem) {
          (elem as HTMLElement).addEventListener('blur', (e) => { onInputBlur(e, key); });
        }
      }
    }
  }, [onBlur, onInputBlur, refs]);

  const validate = () => {
    const newForms = { ...forms.current };
    for (const [k, valFn] of (Object.entries(validation) as Entries<typeof validation>)) {
      const key = k as keyof T;
      if (!valFn) {
        newForms[key] = { valid: true, message: null };
        continue;
      }
      try {
        const value = refs[key].current?.value;
        const parsed = (valFn as ValFn)(value, z);
        parsedFormData.current[key] = parsed;
        newForms[key] = { valid: true, message: null };
      } catch (error) {
        let msg = error.message;
        if (error instanceof ZodError) {
          msg = error.issues[0].message;
        }
        newForms[key] = { valid: false, message: msg };
      }
    }
    setForms(newForms);
  };

  const getFormData = useCallback(() => {
    const all = Object.fromEntries(
      Object.entries(refs).map(([k, elm]) => ([k, elm.current?.value || ''])),
    ) as {[K in keyof T]: string};

    return {
      ...all,
      ...parsedFormData.current,
    } as unknown as Expand<OverWrite<
      {[K in keyof T]: string},
      {[K in keyof V]: ReturnType<Exclude<typeof validation[K], undefined>>}
    >>;
  }, [refs]);

  const isAllValid = useCallback(() => (
    Object.values(forms.current).every((f) => f.valid === true)
  ), [forms]);

  return {
    validate,
    getFormData,
    isAllValid,
    forms: forms.current,
  };
};

export default useUncontrolledFormValidation;
