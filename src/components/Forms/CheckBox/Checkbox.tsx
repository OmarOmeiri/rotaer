import React from 'react';
import classes from './Checkbox.module.css';
import { ICheckBoxProps } from './typings';

/**
 * Renders the checkbox component
 * @param {*} props
 * @returns
 */
const Checkbox2: React.FC<ICheckBoxProps> = ({
  label,
  id,
  checked = false,
  inputClassName,
  inputStyle,
  name,
  group,
  checkBoxKey,
  selected,
  wrapperClass,
  labelSelectable,
  uncontrolledCheckBox = false,
  wrapperStyle,
  labelId,
  labelStyle,
  labelClassName,
  disabled,
  labelTextStyle,
  checkBoxType = 'X',
  extraAttrs,
  labelAttrs,
  onChange = () => {},
  onClick = () => {},
}) => (
  <div className={`${classes.CheckBoxWrapperOuter} ${wrapperClass} ${selected ? 'listbox-selected' : null}`} key={checkBoxKey} style={wrapperStyle}>
    { label ? <div className={classes.LabelTextDummy}>{label}</div> : null}
    <label key={checkBoxKey} id={labelId} style={labelStyle} className={`${classes.CheckBoxWrapper} ${label ? classes.CheckBoxWrapperWithLabel : ''} ${labelClassName} ${disabled ? classes.CheckBoxDisabled : ''}`} {...labelAttrs}>
      <input disabled={disabled} name={name} data-group={group} style={inputStyle} className={`${inputClassName} ${classes.Input}`} id={id} type="checkbox" onChange={onChange} checked={uncontrolledCheckBox ? undefined : checked} {...extraAttrs} />
      <span className={`${classes.Checkmark} ${checkBoxType === 'X' ? classes.CheckmarkX : classes.CheckmarkV}`} />
      { label ? <div className={classes.LabelText} style={labelTextStyle}>{label}</div> : null}
    </label>
    {
      labelSelectable
        ? (
          <div
            id={id}
            data-checked={checked}
            className={`${classes.SelectableLabel}`}
            data-group={group}
            data-name={name}
            onClick={onClick}
            aria-label={`selecionar ${name}`}
            onKeyDown={onClick}
            role="button"
            tabIndex={0}
            {...extraAttrs}
          />
        )
        : null
    }
  </div>
);

export default Checkbox2;
