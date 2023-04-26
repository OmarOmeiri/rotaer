import UpCaret from '@assets/icons/caret-up-fill.svg';
import DownCaret from '@assets/icons/caret-down-fill.svg';
import DashSolid from '@assets/icons/dash-solid.svg';
import { round as rnd } from 'lullo-utils/Math';
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
  num: number,
  colors: TColors | undefined,
  reverse: boolean | undefined,
  isNaN: boolean | undefined,
  onNaN: 'positive' | 'negative' | undefined,
) => {
  if (num > 0 || (isNaN && onNaN === 'positive')) {
    return reverse
      ? (colors?.down || DEFAULT_COLORS.down)
      : (colors?.up || DEFAULT_COLORS.up);
  }

  if (num < 0 || (isNaN && onNaN === 'negative')) {
    return reverse
      ? (colors?.up || DEFAULT_COLORS.up)
      : (colors?.down || DEFAULT_COLORS.down);
  }

  return colors?.zero || DEFAULT_COLORS.zero;
};

export const UpDownPct = ({
  children,
  pct,
  colors,
  round = 2,
  width,
  reverse,
  onNaN,
}:{
  children: number,
  pct?: boolean,
  colors?: TColors
  round?: number,
  width?: string,
  reverse?: boolean,
  onNaN?: 'positive' | 'negative'
}) => {
  const num = pct ? rnd(children * 100, round) : rnd(children, round);
  const isNaN = Number.isNaN(num);
  const numStr = isNaN
    ? 'NA'
    : `${num.toLocaleString('pt-BR')}%`;

  if (num > 0 || (isNaN && onNaN === 'positive')) {
    return (
      <Wrapper color={getColor(num, colors, reverse, isNaN, onNaN)}>
        <UpCaret style={{
          width: width || '1rem',
        }}/>
        <span>{numStr}</span>
      </Wrapper>
    );
  }

  if (num < 0 || (isNaN && onNaN === 'negative')) {
    return (
      <Wrapper color={getColor(num, colors, reverse, isNaN, onNaN)}>
        <DownCaret style={{
          width: width || '1rem',
        }}/>
        <span>{numStr}</span>
      </Wrapper>
    );
  }

  return (
    <Wrapper color={getColor(num, colors, reverse, isNaN, onNaN)}>
      <DashSolid style={{
        width: width || '1rem',
      }}/>
      <span>{numStr}</span>
    </Wrapper>
  );
};
