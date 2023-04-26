import styled, { css } from 'styled-components';
import { ChartLegendIconTypes, ChartLegendItem, getChartLegendItem } from './helpers';

const getHeight = (h: number | `${number}%`) => {
  if (!Number.isNaN(Number(h))) return `${h}px`;
  return String(h);
};

const LegendWrapper = styled.div`
${(props: {maxHeight?: number | `${number}%`}) => {
    if (!props.maxHeight) {
      return css`margin: 1em;`;
    }
    return css`
    margin: 1em;
    max-height: ${getHeight(props.maxHeight)};
    overflow-y: scroll;`;
  }}
`;

type Props = {
  items: ChartLegendItem[],
  type: ChartLegendIconTypes,
  maxHeight?: number | `${number}%`
  onClick: (item: ChartLegendItem) => void
}

export const ChartLegend = ({
  items,
  type,
  maxHeight,
  onClick,
}: Props) => (
  <LegendWrapper maxHeight={maxHeight}>
    {
        getChartLegendItem(
          items
            .filter((i) => i.active)
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
          type,
          onClick,
        )
      }
    {
        getChartLegendItem(
          items
            .filter((i) => !i.active)
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
          type,
          onClick,
        )
      }
  </LegendWrapper>
);
