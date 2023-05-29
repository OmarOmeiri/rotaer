'use client';

import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import Loading from '@assets/icons/loading.svg';
import Config from '../../config';
import classes from './ButtonClient.module.css';

interface BtnStyleProps {
  btnStyleType?: 'greenRound' | 'danger'
}

interface IButtonClientProps extends BtnStyleProps {
  onClick?: React.MouseEventHandler
  loading?: boolean,
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
          background: linear-gradient(#0000, rgb(0 0 0/25%)) top/100% 800%;
          background-color: ${styles.colors.greenBright};
          color: ${styles.colors.black};
          border-radius: 500px;
          padding: 8px 35px;
          line-height: 30px;`;
      case 'danger':
        return css`
          background: linear-gradient(#0000, rgb(0 0 0/25%)) top/100% 800%;
          background-color: #a02e2e;
          color: #ffffff;
          border-radius: 5px;
          padding: 8px 25px;
          line-height: 20px;
      `;
      default:
        return css`
          background: linear-gradient(#0000, rgb(0 0 0/25%)) top/100% 800%;
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
const ButtonClient = forwardRef(({
  onClick,
  children,
  type = 'button',
  className,
  style,
  loading,
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
    {
      loading ? (
        <div className={classes.LoadingWrapper}>
          <Loading/>
        </div>
      ) : children
    }
  </StyledButton>
));

export default ButtonClient;
