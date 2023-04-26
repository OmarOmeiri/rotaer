import React, {
  forwardRef,
  memo,
} from 'react';
import { SxProps, Theme } from '@mui/material';
import { BaseCheckboxList } from './CheckboxListBase';
import { useCheckboxList } from './useCheckboxList';
import { typedMemo } from '../../utils/React/typedMemo';

type Props = {
  checked?: Array<string>;
  listStyles?: SxProps<Theme>
  checkboxStyles?: SxProps<Theme>
  listItemStyles?: SxProps<Theme>
  values: Array<string | boolean> | Array<{value: string | JSX.Element, id: string, disabled?: boolean}>,
  name: string,
  onChange: ListSelectEventHandler,
}

const CheckboxList = forwardRef(({
  checked: initChecked,
  listStyles = {},
  checkboxStyles = {},
  listItemStyles = {},
  name,
  values,
  onChange,
}: Props, ref: React.ForwardedRef<HTMLUListElement>) => {
  const {
    checked,
    handleToggle,
  } = useCheckboxList({
    initChecked,
    values,
    onChange,
  });

  return (
    <BaseCheckboxList
      ref={ref}
      checked={checked}
      listStyles={listStyles}
      checkboxStyles={checkboxStyles}
      listItemStyles={listItemStyles}
      values={values}
      name={name}
      handleToggle={handleToggle}
    />
  );
});

export default typedMemo(CheckboxList);
