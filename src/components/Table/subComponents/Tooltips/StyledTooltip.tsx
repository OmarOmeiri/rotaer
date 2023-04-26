import styled, { css } from 'styled-components';
import { TableStyles } from '../../styles';
import { WithTooltip } from '../../../../hoc/Tooltip/WithTooltip';

export const StyledTableTooltip = styled(WithTooltip)`
${({ styles: { header: { tooltip } } }: { styles: TableStyles; }) => (
    css`
      background-color: ${tooltip.background};
      color: ${tooltip.color};
      z-index: 2;
      h4 {
        color: ${tooltip.titleColor};
        border-bottom: ${tooltip.titleBorder};
      }`
  )}`;
