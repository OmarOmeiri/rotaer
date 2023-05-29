import React from 'react';
import { TabProps } from './Tabs';

const Tab = (props: {
  children: React.ReactNode;
  className?: string,
  style?: React.CSSProperties
  hidden?: boolean,
} & TabProps) => (
  <div {...props} className={props.className || ''}>
    {props.children}
  </div>
);

export default Tab;
