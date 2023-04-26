import React from 'react';
import styled, { css } from 'styled-components';

type ResponsiveGridProps = {
  children: React.ReactNode,
  minWidth: number | `${number}%`,
  gap?: {h?: string, v?: string}
}

const getWidth = (w: number | `${number}%`) => {
  if (typeof w === 'number' || !Number.isNaN(Number(w))) return `${Number(w)}px`;
  return w;
};

const Wrapper = styled.div`
${({ minWidth, gap }: Pick<ResponsiveGridProps, 'minWidth' | 'gap'>) => (
    css`
    width: 100%;
    margin: 0 auto;
    display: grid;
    gap: ${gap?.h || '1rem'} ${gap?.v || '1rem'};
    grid-template-columns: repeat(auto-fit, minmax(${getWidth(minWidth)}, 1fr));`
  )}`;

const ResponsiveGrid = ({
  minWidth,
  children,
  gap,
}: ResponsiveGridProps) => (
  <Wrapper minWidth={minWidth} gap={gap}>
    {children}
  </Wrapper>
);

ResponsiveGrid.displayName = 'ResponsiveGrid';
export default ResponsiveGrid;
