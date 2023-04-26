'use client';

import {
  cloneElement,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  autoUpdate,
  flip,
  offset,
  Placement,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react-dom-interactions';
import Portal from '../../hoc/portal/Portal';

interface Props {
  tooltip: React.ReactNode;
  placement?: Placement;
  children: React.ReactElement;
  className?: string,
  delay?: number;
  onOpen?: () => void
}

export const TooltipHover = forwardRef(({
  children,
  tooltip,
  placement = 'bottom',
  className,
  delay = 0,
  onOpen,
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

  // console.log({
  //   x,
  //   y,
  //   reference,
  //   floating,
  //   strategy,
  //   context,
  // });

  useLayoutEffect(() => {
    const ref = positioningRef as React.MutableRefObject<HTMLElement> | null;
    if (ref?.current) {
      reference({
        getBoundingClientRect: () => {
          const rect = ref.current.getBoundingClientRect();
          return rect;
        },
        contextElement: ref?.current,
      });
    }
  }, [reference, positioningRef]);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      delay: { open: delay, close: 0 },
      handleClose: safePolygon({
        blockPointerEvents: false,
      }),
    }),
    useRole(context, { role: 'tooltip' }),
    useDismiss(context),
  ]);

  useEffect(() => {
    if (open && onOpen) {
      onOpen();
    }
  }, [open, onOpen]);

  // Preserve the consumer's ref
  // const ref = useMemo(() => mergeRefs([reference, (children as any).ref]), [
  //   reference,
  //   children,
  // ]);

  return (
    <>
      {
        cloneElement(children, getReferenceProps({
          ref: (e) => {
            if (typeof (children as any).ref === 'function') {
              (children as any).ref(e);
            } else if ('current' in ((children as any)?.ref || {})) {
              (children as any).ref.current = e;
            }
            reference(e);
          },
          ...children.props,
        }))
      }
      {open && (
        <Portal id="overlay-tooltip">
          <div
          ref={floating}
          className={className}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 4,
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
