import React from 'react';
import styled from 'styled-components';
import Config from '@config';
import LogoSm from '@assets/icons/rotaer_icon.svg';
import classes from './GenericModal.module.css';

const styles = Config.get('styles');

const StyledTitle = styled.div`
  color: ${styles.colors.lightGrey};
  border-bottom: 1px solid ${styles.colors.grey};`;

type Props = {
  title?: string,
  children: React.ReactNode,
  withLogo?: boolean
  logoStyle?: React.CSSProperties
}

const GenericModal = ({
  title, children, logoStyle, withLogo = false,
}: Props) => (
  <>
    {
    withLogo
      ? (
        <LogoSm style={{
          position: 'absolute',
          opacity: '0.05',
          left: 'calc(25%)',
          top: 'calc(25%)',
          width: '50%',
          ...logoStyle,
        }}/>
      )
      : null
  }
    <div className={classes.Wrapper}>
      {
          title
            ? (
              <StyledTitle className={classes.Title}>
                {title}
              </StyledTitle>
            )
            : null
        }

      <div className={classes.Contents}>
        {children}
      </div>
    </div>
  </>
);

export default GenericModal;

