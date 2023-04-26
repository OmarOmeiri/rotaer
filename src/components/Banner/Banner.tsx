import styled from 'styled-components';
import classes from './Banner.module.css';

type Props = {
  children: JSX.Element,
}

type ImgProps = {
  height: string
}

const Wrapper = styled.div`
height: ${(props: ImgProps) => props.height};`;

const Banner = ({ children, height }: Props & ImgProps) => (
  <Wrapper height={height} className={classes.Wrapper}>
    {children}
  </Wrapper>
);

export default Banner;

