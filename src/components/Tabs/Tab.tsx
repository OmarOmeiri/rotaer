import React from 'react';
import { TabProps } from './Tabs';

export const Tab = ({
  children,
  className,
  style,
  label,
}: {
  children: React.ReactNode;
  className?: string,
  style?: React.CSSProperties
} & TabProps) => (
  <div style={style} className={className || ''} data-label={label}>
    {children}
  </div>
);
