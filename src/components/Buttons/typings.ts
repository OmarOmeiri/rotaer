import React from 'react';

export enum btnStyleType {
  success ='success',
  danger = 'danger',
  main = 'main',
  norm = 'norm',
}

export interface IButtonMainProps {
  onClick?: React.MouseEventHandler,
  className?: string,
  styleType?: btnStyleType,
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'],
  style?: React.CSSProperties,
  children: React.ReactNode,
}
