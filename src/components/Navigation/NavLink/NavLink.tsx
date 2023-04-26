import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import Config from '@/config';
import classes from './NavLink.module.scss';

export interface ITypedNavLinkProps {
  to: string | '#',
  queryParams?: {[key: string]: string},
  id?: string,
  [key: string]: any
}

const styles = Config.get('styles').navBar;

const StyledLink = styled(Link)`
  color: ${styles.colors.text};
  cursor: pointer;
  pointer-events: all;
  &:hover {
    color:  ${styles.colors.textHover};
  }
`;

const formatParams = (params?: {[key: string]: string}) => {
  if (!params || !Object.keys(params).length) return '';
  return Object.entries(params).reduce((str, [k, p], i) => {
    if (!i) return `${str}${k}=${p}`;
    return `&${k}=${p}`;
  }, '?');
};

const formatURL = (
  url: string,
  params?: {[key: string]: string},
  id?: string,
) => {
  if (!params && !id) return url;
  return `${
    url.replace(/\/$/, '')
  }${
    formatParams(params)
  }${id ? `#${id.replace(/^#/, '')}` : ''}`;
};

const TypedNavLink: React.FC<ITypedNavLinkProps> = ({
  to,
  id,
  queryParams,
  children,
  ...rest
}) => (
  <StyledLink className={classes.NavLink} href={formatURL(to, queryParams, id)} {...rest}>
    {children}
  </StyledLink>
);

export default TypedNavLink;
