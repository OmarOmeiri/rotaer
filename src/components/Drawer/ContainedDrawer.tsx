import React, {
  cloneElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { isForwardRef } from 'react-is';
import { colors } from '@/config/styles/colors';
import { useResizeObserver } from '@/hooks/DOM/useResizeObserver';
import { getElmDimensionsNoContent } from '@/utils/HTML/getElmDimensionsNoContent';
import X from '@icons/X.svg';
import classes from './ContainedDrawer.module.css';

type Props = {
  children: React.ReactElement,
  open: boolean,
  setOpen: SetState<boolean>
}

const style = {
  padding: '1em',
  backgroundColor: colors.darklight,
};

export const Drawer = ({
  children,
  open,
  setOpen,
}: Props) => {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const child = useRef<HTMLElement | null>(null);
  const [afterOpen, setAfterOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);

  if (!isForwardRef(children)) {
    throw new Error('Drawer needs the child to accept ref forwarding.');
  }

  if ('ref' in children && children.ref) {
    child.current = children.ref as HTMLElement;
  }

  const onChildResize = useCallback((entry: ResizeObserverEntry) => {
    if (wrapper.current) {
      wrapper.current.style.width = `${Math.max(entry.contentRect.width + initialWidth, wrapper.current.offsetWidth)}px`;
    }
  }, [initialWidth]);

  useResizeObserver({
    element: child,
    callback: onChildResize,
  });

  const getWrapperEntry = useResizeObserver({
    element: wrapper,
  });

  const onClickOutside = useCallback((e: MouseEvent) => {
    if (!afterOpen) return;
    const ref = wrapper.current;
    if (!ref) return;
    const withinBoundaries = e
      .composedPath()
      .includes(ref);
    if (!withinBoundaries) {
      setOpen(false);
    }
  }, [setOpen, afterOpen]);

  const onOpen = useCallback(() => {
    if (wrapper.current) {
      wrapper.current.style.width = `${width}px`;
      wrapper.current.classList.add(classes.Open);
      wrapper.current.classList.remove(classes.Closed);
    }
  }, [width]);

  const onClose = useCallback(() => {
    if (wrapper.current) {
      wrapper.current.style.removeProperty('width');
      wrapper.current.classList.remove(classes.Open);
      wrapper.current.classList.add(classes.Closed);
    }
  }, []);

  useEffect(() => {
    if (open) {
      onOpen();
      setAfterOpen(true);
      return;
    }
    onClose();
    setAfterOpen(false);
  }, [open, onClose, onOpen]);

  useEffect(() => {
    if (wrapper.current) {
      setInitialWidth(wrapper.current.offsetWidth);
    }
  }, []);

  useLayoutEffect(() => {
    const entry = getWrapperEntry();
    if (entry) {
      setWidth((state) => {
        if (Math.abs(state - entry.target.scrollWidth) > 3) return entry.target.scrollWidth;
        return state;
      });
    }
    if (wrapper.current) {
      setInitialWidth(getElmDimensionsNoContent(wrapper.current).width);
    }
  }, [children, getWrapperEntry]);

  useEffect(() => {
    document.addEventListener('click', onClickOutside);
    return () => {
      document.removeEventListener('click', onClickOutside);
    };
  }, [onClickOutside]);

  return (
    <div className={classes.Container}>
      <div className={`${classes.Wrapper} ${classes.Closed}`} ref={wrapper} style={style}>
        <div className={classes.CloseBtnDiv}>
          <button className={classes.CloseBtn} onClick={() => setOpen(false)} aria-label="close" style={{ color: colors.green }}>
            <X/>
          </button>
        </div>
        {
          cloneElement(children, {
            ...children.props,
            ref: child,
          })
        }
      </div>
    </div>
  );
};
