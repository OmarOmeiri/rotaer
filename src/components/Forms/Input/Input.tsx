import { debounce as dbnc } from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { IMaskInput } from 'react-imask';
import styled, { css } from 'styled-components';
import Config from '@/config';
import { IInput } from '../typings';
import classes from './Input.module.css';

const styles = Config.get('styles');

const inputDefaultStyle = css`
  outline: none;
  height: 35px;
  transition: all 0.30s ease-in-out;
`;

const inputTransparentStyle = css`
background-color: transparent;
border-radius: 8px;
border: 1px solid ${styles.colors.grey};
outline: ${styles.colors.white};
color: ${styles.colors.green};
padding: 3px 0px 3px 3px;
margin: 5px 1px 3px 0px;
&:focus {
  box-shadow: 0 0 5px ${styles.colors.green};
  padding: 3px 0px 3px 3px;
  margin: 5px 1px 3px 0px;
  border: 1px solid ${styles.colors.green};
}`;

const StyledInput = styled.input`
${({ styleType }: {styleType: IInput['styleType']}) => {
    switch (styleType) {
      case 'transparent':
        return css`
          ${css`${inputDefaultStyle}`}
          ${css`${inputTransparentStyle}`}`;
      default:
        return css`${inputDefaultStyle}`;
    }
  }}`;

/**
 *
 * @param {*} param0
 * @returns
 */
const Input = forwardRef(({
  id,
  label,
  mask,
  value,
  type,
  maskBlock,
  style,
  styleType,
  inputStyle,
  labelStyle,
  labelInnerStyle,
  labelClassName,
  labelSideComponent,
  placeholder,
  min,
  max,
  name,
  inputClassName,
  wrapperClassName,
  validationMsg,
  valid,
  display,
  debounce,
  onChange,
  onBlur,
  onKeyUp,
  onKeyDown,
}: IInput, ref: React.ForwardedRef<HTMLInputElement>) => {
  const localRef = useRef<HTMLInputElement>(null);
  const eventRef = useRef<React.ChangeEvent<HTMLInputElement> | null>(null);

  useImperativeHandle(ref, () => localRef.current as HTMLInputElement);

  const onClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const isDebounced = () => (
    debounce && debounce > 0
  );

  useEffect(() => {
    if (
      isDebounced()
      && localRef.current
      && typeof value === 'string'
    ) {
      localRef.current.value = value;
    }
  });

  const debouncer = useRef(dbnc(() => {
    const value = localRef?.current?.value ?? null;
    if (
      value !== null
      && eventRef.current
      && onChange
    ) {
      Object.defineProperty(eventRef.current, 'target', { writable: false, value: localRef.current });
      onChange(eventRef.current);
    }
  }, debounce || 0)).current;

  const change: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    if (onChange) {
      if (!isDebounced()) onChange(e);
      else {
        eventRef.current = e;
        debouncer();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, debounce]);

  if (display === false) return null;
  return (
    <div style={style} className={`${valid === false ? classes.Invalid : ''}${wrapperClassName ? ` ${wrapperClassName}` : ''}`}>
      <label style={labelStyle} className={`${labelClassName || ''} ${classes.Label}`}>
        {
          label
            ? (<div style={labelInnerStyle}>
              <span>
                {label}
              </span>
              {labelSideComponent || null}
            </div>)
            : null
        }
        {
          valid === false && validationMsg
            ? (
              <span className={classes.ValidationMsg}>*{validationMsg}</span>
            )
            : null
        }
        {
          !mask ? (
            <StyledInput
              id={id}
              styleType={styleType}
              value={isDebounced() ? undefined : value}
              type={type}
              style={inputStyle}
              placeholder={placeholder}
              min={min}
              max={max}
              name={name}
              ref={localRef}
              onChange={change}
              onBlur={onBlur}
              onKeyUp={onKeyUp}
              onKeyDown={onKeyDown}
              onClick={onClick}
              data-name={name}
              className={`${inputClassName || ''} ${classes.Input}`}
            />
          ) : (
            <IMaskInput
              id={id}
              mask={mask as any}
              value={isDebounced() ? undefined : value}
              type={type}
              blocks={maskBlock}
              style={inputStyle}
              placeholder={placeholder}
              min={min}
              max={max}
              name={name}
              ref={localRef as any}
              onChange={change}
              onBlur={onBlur}
              onKeyUp={onKeyUp}
              onKeyDown={onKeyDown}
              onClick={onClick as any}
              data-name={name}
              className={`${inputClassName || ''} ${classes.Input}`}
            />
          )
        }

      </label>
    </div>
  );
});

export default Input;

// {

//   getInput({
//     id,
//     label,
//     mask,
//     value,
//     type,
//     maskBlock,
//     style,
//     inputStyle,
//     labelClassName,
//     required,
//     placeholder,
//     min,
//     max,
//     name,
//     inputClassName,
//     styleType,
//     valid,
//     validationMsg,
//     onChange,
//     onBlur,
//     onKeyUp,
//     onKeyDown,
//   }, localRef)
// }
