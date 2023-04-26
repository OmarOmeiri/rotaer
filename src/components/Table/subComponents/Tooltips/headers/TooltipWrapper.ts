import styled, { css } from 'styled-components';
import { tableStyles, TableStyles } from '../../../styles';

export const TableTooltipWrapper = styled.div`
${({ applied, iconStyle }: {applied: boolean, iconStyle?: DeepPartial<TableStyles['header']['controlIcons']>}) => (
    applied ? (
      css`
      color: ${iconStyle?.appliedColor || tableStyles.header.controlIcons.appliedColor};`
    ) : (
      css`
      color: ${iconStyle?.color || tableStyles.header.controlIcons.color};`
    )
  )}`;
