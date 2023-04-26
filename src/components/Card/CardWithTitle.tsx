'use client';

import PlusCircle from '@assets/icons/plus-circle.svg';
import MinusCircle from '@assets/icons/minus-circle.svg';
import { useCallback, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import classes from './Card.module.css';

const Content = ({
  height,
  collapsed,
  children,
}:{
  collapsed: boolean,
  children: React.ReactNode,
  height?: number
}) => {
  if (height) {
    return (
      <AnimateHeight
        height={collapsed ? height : 'auto' }
        className={`${classes.CollapsibleWrapper} ${collapsed ? classes.Collapsed : ''}`}
      >
        {children}
      </AnimateHeight>
    );
  }

  return <>{children}</>;
};

const CardWithTitle = ({
  title,
  Icon,
  children,
  className,
  contentClassName,
  titleClassName,
  TitleComponent,
  collapsible,
}: {
  title: string
  Icon?: JSX.Element
  children: React.ReactNode,
  className?: string
  contentClassName?: string
  titleClassName?: string,
  TitleComponent?: React.ElementType
  collapsible?: {
    height: number
  }
}) => {
  const [collapsed, setCollapsed] = useState(!!collapsible?.height);
  const isCollapsible = !!collapsible?.height;

  const onCollapse = useCallback(() => {
    setCollapsed((state) => !state);
  }, []);

  return (
    <div className={`${classes.CardWithTitle} ${className || ''}`}>
      <div className={`${classes.CardTitle} ${titleClassName || ''}`}>
        {
          Icon
            ? (
              <div className={classes.IconWrapper}>
                {Icon}
              </div>
            )
            : null
        }
        <span>{title}</span>
        {
        TitleComponent
          ? <TitleComponent/>
          : null
      }
      </div>
      <Content height={collapsible?.height} collapsed={collapsed}>
        <div
          className={`${
            classes.CardWithTitleContent
          } ${
            contentClassName || ''
          } ${
            collapsed ? classes.CollapsedContent : ''
          } ${
            isCollapsible ? classes.CollapsibleContent : ''
          }`}
        >
          {children}
        </div>
      </Content>
      {
        isCollapsible
          ? (
            <div className={classes.CollapseBtn}>
              <button onClick={onCollapse}>
                {
                  collapsed
                    ? <PlusCircle/>
                    : <MinusCircle/>
                }
              </button>
            </div>
          ) : null
      }

    </div>
  );
};

export default CardWithTitle;
