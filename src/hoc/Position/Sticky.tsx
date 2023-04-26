/* eslint-disable import/no-anonymous-default-export */
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useIntersectionObserver } from '../../hooks/DOM/useIntersectionObserver';
import { useScrollDirection } from '../../hooks/DOM/useScrollDirection';
import { useFirstRender } from '../../hooks/React/useFirstRender';

type Props = {
  root: React.MutableRefObject<HTMLElement | null>
  children: React.ReactElement,
  classToAdd: string,
  inViewInit?: boolean,
  onStick?(
    stick: boolean,
    ref: React.MutableRefObject<HTMLDivElement | null>,
    refClone: React.MutableRefObject<HTMLDivElement | null>,
  ): void,
}

const Sticky = forwardRef(({
  root,
  children,
  classToAdd,
  inViewInit,
  onStick,
}: Props, ref: React.ForwardedRef<HTMLDivElement | null> | undefined): React.ReactElement => {
  const isFirstRender = useFirstRender();
  const localRef = useRef<HTMLDivElement | null>(null);
  const cloneRef = useRef<HTMLDivElement | null>(null);
  const scrollDirection = useRef<'up' | 'down'>('down');
  const [inView, setInView] = useState(inViewInit !== false);
  useImperativeHandle(ref, () => localRef?.current as HTMLDivElement);

  const options = useMemo(() => ({
    root: root?.current || null,
    rootMargin: '0px 40000px 0px 40000px',
    threshold: [0, 1],
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [isFirstRender]);

  const getScrollDirection = useCallback((dir: 'up' | 'down') => {
    scrollDirection.current = dir;
  }, []);

  const observe = useCallback((_: boolean, ent: IntersectionObserverEntry) => {
    const { y } = ent.boundingClientRect;
    const rootY = ent.intersectionRect?.y;
    const ratio = Math.max(1 / (rootY / y), 0);
    if (scrollDirection.current === 'down' && ratio < 1) {
      setInView(false);
    }
    if (scrollDirection.current === 'up' && ratio === 1) {
      setInView(true);
    }
  }, []);

  useIntersectionObserver(localRef, observe, options, [isFirstRender]);

  useScrollDirection(getScrollDirection, root.current, [isFirstRender]);

  const onSticky = useCallback((stick: boolean) => {
    if (onStick) onStick(stick, localRef, cloneRef);
  }, [onStick]);

  const setRefs = useCallback((node: HTMLDivElement) => {
    localRef.current = node;
  }, []);

  const handleSticky = useCallback((inView: boolean) => {
    if (cloneRef.current) {
      if (!inView) {
        if (!cloneRef.current.classList.contains(classToAdd)) {
          cloneRef.current.classList.add(classToAdd);
          onSticky(true);
        }
      } else if (cloneRef.current.classList.contains(classToAdd)) {
        cloneRef.current.classList.remove(classToAdd);
        onSticky(false);
      }
    }
  }, [classToAdd, onSticky]);

  useEffect(() => {
    handleSticky(inView);
  }, [inView, handleSticky]);

  if (inView) {
    return (
      <>
        {
          React.cloneElement(children, {
            ref: setRefs,
          })
        }
      </>
    );
  }
  return (
    <>
      {
          React.cloneElement(children, {
            ref: setRefs,
            style: {
              position: 'absolute',
              zIndex: '-1',
              visibility: 'hidden',
              top: '0',
            },
          })
        }
      {
        React.cloneElement(children, {
          ref: cloneRef,
        })
      }
    </>
  );
});

export default Sticky;
