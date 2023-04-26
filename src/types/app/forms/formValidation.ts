import { IInput } from '@/components/Forms/typings';

import type zd from 'zod';

export type ValidationFunc = (val: string | string[], z: typeof zd) => Primitives | Date | undefined;
export type IValidate<F extends IFormData<true>> = {
  [K in keyof F]?: (val: F[K], z: typeof zd) => ReturnType<ValidationFunc>;
};

export type IForms<T extends IFormData<true>> = Omit<IInput, 'name'> & {
  name: keyof T;
}

