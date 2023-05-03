import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import MagnifyingGlass from '@assets/icons/search-magnifier.svg';
import Config from '@/config';
import { useClickOutside } from '@/hooks/DOM/useClickOutside';
import { isChildOfElem } from '../../utils/HTML/htmlFuncs';
import classes from './Search.module.css';

type Props = {
  height?: number,
  maxWidth?: number,
  inputBg?: string,
  fontSize?: string,
  color?: string,
  placeholder?: string
  value?: string,
  onChange?: React.ChangeEventHandler,
  onSubmit?: React.FormEventHandler
}

type FormProps = Required<
Pick<
Props,
'height'
| 'maxWidth'
| 'inputBg'
>
> & {
  isOpen: boolean
}

type InputProps = Required<
Pick<
Props,
'color'
| 'fontSize'
>>

const styles = Config.get('styles').navBar;
const { colors } = Config.get('styles');

const Form = styled.form`
${
  (props: FormProps) => css`
    height: ${props.height}px;
    width: ${props.isOpen ? 'unset' : props.height}px;
    max-width: 145px;
    background: ${props.inputBg};
    border: ${props.isOpen ? `1px solid ${colors.green}` : 'unset'};
    @media screen and (min-width: 450px){
      max-width: ${props.maxWidth}px;
    }`
}`;

const Input = styled.input`
${
  (props: InputProps) => css`
    color: ${props.color};
    font-size: ${props.fontSize};`
}`;

const SearchIcon = styled(MagnifyingGlass)`
height: 70%;
width: 70%;
fill: ${styles.icons.colors.stroke};
& * {
  pointer-events: none;
}
`;

const Search = forwardRef(({
  height = 40,
  maxWidth = 200,
  inputBg = colors.black,
  fontSize = '1.1rem',
  color = styles.colors.text,
  placeholder = 'Pesquisa...',
  value,
  onChange,
  onSubmit,
}: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  }, []);

  const onInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const onSubmt = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  }, [onSubmit]);

  const onClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    const id = target.getAttribute('data-id');
    if (id && id === 'search-icon') {
      return;
    }
    if (formRef.current && isChildOfElem({ parent: formRef.current, child: target })) {
      return;
    }
    setIsOpen(false);
  }, []);

  useClickOutside({
    ref: inputRef,
    isOpen,
    cb: onClickOutside,
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  return (
    <Form
      height={height}
      ref={formRef}
      maxWidth={maxWidth}
      inputBg={inputBg}
      isOpen={isOpen}
      onSubmit={onSubmt}
      className={
        `${isOpen === false
          ? classes.fadeOutWidth
          : `${classes.fadeInWidth} ${classes.Active}`
        } ${classes.searchbar}`
      }
      >
      {isOpen === true
        ? (
          <Input
            ref={inputRef}
            className={
              `${isOpen === true
                ? classes.fadeIn
                : classes.fadeOut
              } ${classes.searchInput}`
            }
            type="text"
            name=""
            value={value}
            placeholder={placeholder}
            color={color}
            fontSize={fontSize}
            onChange={onChange}
            onClick={onInputClick}
          />
        ) : null}
      <div
          className={
            `${isOpen === true
              ? classes.fadeOut
              : classes.fadeIn
            } ${classes.iconBg}`
          }
        >
        {
            isOpen === false
              ? (
                <SearchIcon
                  data-id='search-icon'
                  onClick={toggle}
                  className={
                    `${classes.fadeIn} ${classes.searchIcon}`
                  }
                />
              )
              : null
          }

      </div>
    </Form>
  );
});
export default Search;
