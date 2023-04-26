'use client';

import {
  cloneElement,
  forwardRef,
  useLayoutEffect,
  useState,
} from 'react';
import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react-dom-interactions';
import Portal from '../../hoc/portal/Portal';

interface Props {
  tooltip: React.ReactNode;
  placement?: Placement;
  children: React.ReactElement;
  className?: string,
  onClick?: React.MouseEventHandler
}

export const TooltipClick = forwardRef(({
  children,
  tooltip,
  placement = 'bottom',
  className,
  onClick = () => {},
}: Props, positioningRef?: React.ForwardedRef<HTMLElement>) => {
  const [open, setOpen] = useState(false);

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    context,
  } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(5),
      flip(),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useLayoutEffect(() => {
    const ref = positioningRef as React.MutableRefObject<HTMLElement> | null;
    if (ref?.current) {
      reference({
        getBoundingClientRect: () => ref?.current.getBoundingClientRect(),
        contextElement: ref?.current,
      });
    }
  }, [reference, positioningRef]);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context, { role: 'tooltip' }),
    useDismiss(context),
  ]);

  // Preserve the consumer's ref
  // const ref = useMemo(() => mergeRefs([reference, (children as any).ref]), [
  //   reference,
  //   children,
  // ]);

  return (
    <>
      {cloneElement(children, getReferenceProps({
        ref: (e) => {
          if (typeof (children as any).ref === 'function') {
            (children as any).ref(e);
          } else if ('current' in ((children as any)?.ref || {})) {
            (children as any).ref.current = e;
          }
          reference(e);
        },
        onClick,
        ...children.props,
      }))}

      {open && (
        <Portal id="overlay-tooltip">
          <div
          ref={floating}
          className={className}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 2,
          }}
          {...getFloatingProps()}
        >
            {tooltip}
          </div>
        </Portal>
      )}
    </>
  );
});
