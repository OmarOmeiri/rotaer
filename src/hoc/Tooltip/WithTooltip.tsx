import type { Placement } from '@floating-ui/react-dom-interactions';
import React, { forwardRef } from 'react';
import TooltipClick from '@/components/Tooltips/TooltipClick';
import TooltipHover from '@/components/Tooltips/TooltipHover';

type Props = {
  content: string | JSX.Element;
  placement?: Placement;
  children: React.ReactElement;
  className?: string,
  delay?: number,
  onOpen?: () => void,
  onClick?: undefined
  type?: 'hover'
} | {
  content: string | JSX.Element;
  placement?: Placement;
  children: React.ReactElement;
  className?: string,
  onOpen?: undefined,
  delay?: undefined,
  onClick?: React.MouseEventHandler
  type?: 'click'
}

export const WithTooltip = forwardRef(({
  children,
  content,
  placement,
  className,
  type = 'click',
  delay,
  onClick,
  onOpen,
}: Props, ref: React.ForwardedRef<HTMLElement>) => {
  if (type === 'hover') {
    return (
      <TooltipHover
        tooltip={content}
        placement={placement}
        className={className}
        ref={ref}
        delay={delay}
        onOpen={onOpen}
      >
        {children}
      </TooltipHover>
    );
  }
  return (
    <TooltipClick
      tooltip={content}
      placement={placement}
      className={className}
      ref={ref}
      onClick={onClick}
    >
      {children}
    </TooltipClick>
  );
});
