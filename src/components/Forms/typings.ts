import React from 'react';
import type { AnyMaskedOptions } from 'imask';

export enum inputTypes {
  text = 'text',
  email = 'email',
  password = 'password',
  number = 'number',
  date = 'date',
  textarea = 'textarea',
  dropdown = 'dropdown',
  checkbox = 'checkbox',
  component = 'component',
}

interface InputBase {
  id?: string;
  label?: string,
  value?: string;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  labelInnerStyle?: React.CSSProperties;
  labelClassName?: string,
  name: string;
  wrapperClassName?: string,
  inputClassName?: string;
  valid?: boolean | null,
  validationMsg?: string | null,
  labelSideComponent?: JSX.Element,
  styleType?: 'default' | 'transparent',
  display?: boolean,
  debounce?: number,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface InputText extends InputBase {
  type?: inputTypes.email
  | inputTypes.password
  | inputTypes.text
  | inputTypes.textarea;
  mask?: RegExp | string | NumberConstructor,
  maskBlock?: { [key: string]: AnyMaskedOptions; }
  placeholder?: string;
  min?: undefined;
  max?: undefined;
  isMulti?: undefined,
}

interface InputNumber extends InputBase {
  type?: inputTypes.number;
  mask?: undefined
  maskBlock?: undefined
  placeholder?: undefined;
  min?: number;
  max?: number;
  isMulti?: undefined,
}

interface InputDate extends InputBase {
  type?: inputTypes.date;
  mask?: undefined
  maskBlock?: undefined
  placeholder?: undefined;
  min?: undefined;
  max?: undefined;
  isMulti?: undefined,
}

interface InputDropDown extends InputBase {
  type?: inputTypes.dropdown;
  mask?: undefined
  maskBlock?: undefined
  placeholder?: undefined;
  min?: undefined;
  max?: undefined;
  isMulti?: boolean,
}

interface InputCheckBox extends InputBase {
  type?: inputTypes.checkbox;
  mask?: undefined
  maskBlock?: undefined
  placeholder?: undefined;
  min?: undefined;
  max?: undefined;
  isMulti?: undefined,
}

export type IInput =
| InputText
| InputNumber
| InputDate
| InputDropDown
| InputCheckBox;

