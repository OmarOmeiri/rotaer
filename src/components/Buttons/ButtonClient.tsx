/* eslint-disable import/prefer-default-export */
/* eslint-disable react/button-has-type */
import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import Config from '../../config';
import classes from './ButtonClient.module.css';

interface BtnStyleProps {
  btnStyleType?: 'greenRound'
}

interface IButtonClientProps extends BtnStyleProps {
  onClick?: React.MouseEventHandler
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'],
  className?: string,
  style?: React.CSSProperties,
  children: React.ReactNode,
}

const styles = Config.get('styles');

const StyledButton = styled.button`
${(props: BtnStyleProps) => {
    switch (props.btnStyleType) {
      case 'greenRound':
        return css`
        background-color: ${styles.colors.greenBright};
        color: ${styles.colors.black};
        border-radius: 500px;
        padding: 8px 35px;
        line-height: 30px;`;
      default:
        return css`
          background-color: #1d7e1d;
          color: #ffffff;
          border-radius: 5px;
          padding: 8px 25px;
          line-height: 20px;
        `;
    }
  }}
`;

/**
 * A button component
 */
export const ButtonClient = forwardRef(({
  onClick,
  children,
  type = 'button',
  className,
  style,
  btnStyleType,
}: IButtonClientProps, ref: React.ForwardedRef<HTMLButtonElement>) => (
  <StyledButton
      type={type}
      btnStyleType={btnStyleType}
      className={`${classes.Button} ${className ?? ''}`}
      style={style}
      ref={ref}
      onClick={onClick}
    >
    {children}
  </StyledButton>
));
