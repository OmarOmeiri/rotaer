import styled from 'styled-components';
import { colors } from '../../../../../config/styles/colors';

export const StyledTableTip = styled.div`
background-color: ${colors.darklight};
padding: 0.5rem;
border-radius: 5px;
&:before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: -5px;
  left: calc(50% - 5px);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 7px solid ${colors.darklight}; 
}`;
