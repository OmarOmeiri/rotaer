import ThumbsUp from '@assets/icons/thumbs-up.svg';
import ThumbsDown from '@assets/icons/thumbs-down.svg';
import DashSolid from '@assets/icons/dash-solid.svg';
import styled, { css } from 'styled-components';

type TColors = {
  up?: string,
  down?: string,
  zero?: string
}

const Wrapper = styled.div`
${(props: {color: string}) => css`
color: ${props.color};
display: flex;
align-items: center;
justify-content: center;
svg {
  margin-right: 0.2rem;
}
`}`;

const DEFAULT_COLORS = {
  up: '#07b107',
  down: '#ff2121',
  zero: '#fafa44',
};

const getColor = (
  direction: number,
  colors: TColors | undefined,
) => {
  if (direction > 0) {
    return colors?.up || DEFAULT_COLORS.up;
  }

  if (direction < 0) {
    return colors?.down || DEFAULT_COLORS.down;
  }

  return colors?.zero || DEFAULT_COLORS.zero;
};

export const ThumbsUpDown = ({
  direction,
  colors,
  width,
}:{
  direction: number,
  colors?: TColors
  width?: string,
}) => {
  if (direction > 0) {
    return (
      <Wrapper color={getColor(direction, colors)}>
        <ThumbsUp style={{
          width: width || '1rem',
        }}/>
      </Wrapper>
    );
  }

  if (direction < 0) {
    return (
      <Wrapper color={getColor(direction, colors)}>
        <ThumbsDown style={{
          width: width || '1rem',
        }}/>
      </Wrapper>
    );
  }

  return (
    <Wrapper color={getColor(direction, colors)}>
      <DashSolid style={{
        width: width || '1rem',
      }}/>
    </Wrapper>
  );
};
