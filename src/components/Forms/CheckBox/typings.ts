import React from 'react';

export enum checkboxType {
  X = 'X',
  V = 'V'
}

export type ICheckBoxProps = {
  label?: string,
  id: string,
  checked: boolean,
  inputClassName?: string,
  inputStyle?: React.CSSProperties,
  name?: string,
  group?: string,
  checkBoxKey: string,
  selected?: boolean,
  wrapperClass?: string,
  labelSelectable?: boolean,
  uncontrolledCheckBox?: undefined,
  wrapperStyle?: React.CSSProperties,
  labelStyle?: React.CSSProperties,
  labelClassName?: string,
  disabled?: boolean,
  labelId?: string,
  checkBoxAfterStyle?: string,
  checkBoxBeforeStyle?: string,
  checkBoxType?: checkboxType,
  labelTextStyle?: React.CSSProperties,
  onChange?: React.ChangeEventHandler | undefined,
  onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void,
  extraAttrs?: {
    [key: string]: any
  }
  labelAttrs?: {
    [key: string]: any
  }
} | {
  label?: string,
  id: string,
  checked?: boolean,
  inputClassName?: string,
  inputStyle?: React.CSSProperties,
  name?: string,
  group?: string,
  checkBoxKey: string,
  selected?: boolean,
  wrapperClass?: string,
  labelSelectable?: boolean,
  uncontrolledCheckBox: boolean,
  wrapperStyle?: React.CSSProperties,
  labelStyle?: React.CSSProperties,
  labelClassName?: string,
  disabled?: boolean,
  labelId?: string,
  checkBoxAfterStyle?: string,
  checkBoxBeforeStyle?: string,
  checkBoxType?: checkboxType,
  labelTextStyle?: React.CSSProperties,
  onChange?: React.ChangeEventHandler | undefined,
  onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void,
  extraAttrs?: {
    [key: string]: any
  }
  labelAttrs?: {
    [key: string]: any
  }
}
