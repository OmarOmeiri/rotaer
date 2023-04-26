'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import styled, { css } from 'styled-components';
import Config from '@/config';
import { shadeRGB } from '@/utils/Colors';
import classes from './Link.module.scss';

type LinkStyles = {
  color?: string
  hoverColor?: string
}

export type LinkProps = {
  to: string | '#',
  queryParams?: {[key: string]: string},
  id?: string,
  styles?: LinkStyles,
  style?: React.CSSProperties,
  openInNewTab?: boolean,
  [key: string]: any
} | {
  to?: string | '#',
  queryParams: {[key: string]: string},
  id?: string,
  styles?: LinkStyles,
  style?: React.CSSProperties,
  openInNewTab?: boolean,
  [key: string]: any
} | {
  to?: string | '#',
  queryParams?: {[key: string]: string},
  id: string,
  styles?: LinkStyles,
  style?: React.CSSProperties,
  openInNewTab?: boolean,
  [key: string]: any
}

const { colors } = Config.get('styles');

const StyledLink = styled(NextLink)`
  ${({ styles }: {styles?: LinkStyles}) => {
    const color = styles?.color || colors.green;
    const hoverColor = styles?.hoverColor || `rgba(${shadeRGB(colors.rgb.green, 1.5)})`;
    return (
      css`
        position: relative;
        color: ${color};
        cursor: pointer;
        display: inline;
        pointer-events: all;
        background: linear-gradient(to right, ${hoverColor}, ${hoverColor} 50%, ${color} 50%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: 200% 100%;
        background-position: 100%;
        transition: background-position 150ms ease;
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          outline: 0px solid ${color};
          transition: width 150ms ease;
        }
        &:hover {
          background-position: 0 100%;
          color: ${hoverColor};
        }
        &:hover:after {
          outline: 1px solid ${hoverColor};
          width: 100%;
        }`
    );
  }}`;

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

const Link = ({
  to,
  id,
  queryParams,
  children,
  openInNewTab,
  styles,
  style,
  ...rest
}: LinkProps) => {
  const pathname = usePathname();
  const route = to || pathname;
  return (
    <StyledLink
      href={formatURL(route, queryParams, id)}
      className={classes.NavLink}
      style={style}
      styles={styles}
      {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </StyledLink>
  );
};

export default Link;
