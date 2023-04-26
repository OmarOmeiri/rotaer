import styled from 'styled-components';
import { colors } from '../../../../../config/styles/colors';
import Link, { LinkProps } from '../../../../Navigation/Link/Link';

const TitleWrapper = styled.div`
display: flex;
align-items: center;
margin-top: 1rem;`;

const IconWrapper = styled.div`
width: 12px;
color: ${colors.green};`;

const Wrapper = styled.div`
  z-index: 2;
  max-width: 200px;
  padding: 0 1em;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  word-break: break-word;
  border-radius: 4px;
  border: 1px solid white;
  & h4 {
    margin: 1em 0;
    pointer-events: none;
  }
  & p {
    font-size: 0.9rem;
  }
`;

const TableCellTooltip = ({
  title,
  value,
  icon,
  linkProps,
  iconWrapperProps,
}:{
  title: string,
  value: string,
  linkProps?: Omit<LinkProps, 'children'>
  icon?: React.ReactNode,
  iconWrapperProps?: JSXElementProp<HTMLDivElement>
}) => (
  <Wrapper>
    <TitleWrapper>
      <h4 style={{ flexGrow: '1', margin: '0' }}>
        {
          linkProps
            ? (
              <Link {...linkProps as LinkProps} openInNewTab>
                {title}
              </Link>
            )
            : title
        }

      </h4>
      {
        icon
          ? (
            <IconWrapper {...iconWrapperProps as any}>
              {icon}
            </IconWrapper>
          )
          : null
      }
    </TitleWrapper>
    <p>
      {value}
    </p>
  </Wrapper>
);

export default TableCellTooltip;
