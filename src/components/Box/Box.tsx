import React from 'react';
import styled from 'styled-components';
import Config from '../../config';

type Props = {
  title?: {
    text: string,
    style?: React.CSSProperties,
    className?: string
  }
  style?: React.CSSProperties
  className?: string,
  children: JSX.Element
}

const styles = Config.get('styles');

const Title = styled.div`
font-size: 1.1rem;
font-weight: bold;
background-color: ${styles.colors.dark};
border-bottom: 1px solid ${styles.colors.grey};
margin: -1rem;
padding: 1rem;
border-radius: 10px 10px 0 0;
box-shadow: inset 0px 3px 3px ${styles.colors.green};`;

const StyledBox = styled.div`
background-color: ${styles.colors.darklight};
color: ${styles.colors.lightGreen};
padding: 1rem;
border-radius: 10px;`;

const Children = styled.div`
padding-top: 1rem;`;

const Box = ({
  title,
  style,
  className,
  children,
}: Props) => (
  <StyledBox style={style} className={className}>
    {
      title
        ? (
          <Title style={title.style} className={title.className}>
            {title.text}
          </Title>
        )
        : null
    }
    <Children>
      {children}
    </Children>
  </StyledBox>
);

export default Box;
