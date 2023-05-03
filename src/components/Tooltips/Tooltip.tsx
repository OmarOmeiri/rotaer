import React, {
  cloneElement,
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
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
  open: boolean;
  onOpen?: (ref: React.MutableRefObject<HTMLDivElement | null>) => void
}

export const Tooltip = forwardRef(({
  children,
  tooltip,
  placement = 'bottom',
  className,
  delay = 0,
  open,
  onOpen,
}: Props, positioningRef?: React.ForwardedRef<HTMLElement>) => {
  const localRef = useRef<HTMLDivElement | null>(null);
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

  const setRef = useCallback((e: HTMLDivElement) => {
    if (e) {
      floating(e);
      localRef.current = e;
    }
    if (open && onOpen) {
      onOpen(localRef);
    }
  }, [floating, onOpen, open]);

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
          ref={setRef}
          className={className}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 3,
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
