import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type UnstyledLinkProps = {
  to: string | '#',
  queryParams?: {[key: string]: string},
  id?: string,
  style?: React.CSSProperties,
  openInNewTab?: boolean,
  locale?: Langs,
  [key: string]: any
} | {
  to?: string | '#',
  queryParams: {[key: string]: string},
  id?: string,
  style?: React.CSSProperties,
  openInNewTab?: boolean,
  locale?: Langs,
  [key: string]: any
} | {
  to?: string | '#',
  queryParams?: {[key: string]: string},
  id: string,
  style?: React.CSSProperties,
  openInNewTab?: boolean,
  locale?: Langs,
  [key: string]: any
}

const formatParams = (params?: {[key: string]: string}) => {
  if (!params || !Object.keys(params).length) return '';
  return Object.entries(params).reduce((str, [k, p], i) => {
    if (!i) return `${str}${k}=${p}`;
    return `&${k}=${p}`;
  }, '?');
};

const formatURL = (
  url: string,
  params: {[key: string]: string} | undefined,
  id: string | undefined,
) => {
  if (!params && !id) return url;
  return `${
    url.replace(/\/$/, '')
  }${
    formatParams(params)
  }${id ? `#${id.replace(/^#/, '')}` : ''}`;
};

const UnstyledLink = ({
  to,
  id,
  queryParams,
  children,
  openInNewTab,
  style,
  ...rest
}: UnstyledLinkProps) => {
  const pathname = usePathname() || '';
  const route = to || pathname;
  return (
    <NextLink
      href={formatURL(route, queryParams, id)}
      style={style}
      {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </NextLink>
  );
};

export default UnstyledLink;
