import React, {
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { isChildOfElem } from '@/utils/HTML/htmlFuncs';
import { useClickOrDrag } from './useClickOrDrag';

export const useDragScroll = <T extends HTMLElement>({
  ref,
  ignoreIfChildOf,
}: {
  ref: React.MutableRefObject<T | null>
  ignoreIfChildOf?: React.MutableRefObject<HTMLElement | null>
}) => {
  const {
    start,
    isDrag,
  } = useClickOrDrag();
  const mouseDown = useRef(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);

  const onDragStart = useCallback((e: MouseEvent) => {
    if (
      ignoreIfChildOf?.current
      && isChildOfElem({
        parent: ignoreIfChildOf.current,
        child: e.target as HTMLElement,
      })
    ) return;

    start(e);
    if (ref.current) {
      mouseDown.current = true;
      startX.current = e.pageX - ref.current.offsetLeft;
      scrollLeft.current = ref.current.scrollLeft;
    }
  }, [ref, start, ignoreIfChildOf]);

  const onDragEnd = useCallback((e: MouseEvent) => {
    if (!mouseDown.current) return;
    const isChildOfIgnored = ignoreIfChildOf?.current
      ? isChildOfElem({
        parent: ignoreIfChildOf?.current,
        child: e.target as HTMLElement,
      })
      : false;
    if (isDrag(e) && !isChildOfIgnored) {
      e.stopPropagation();
    }
    mouseDown.current = false;
  }, [isDrag, ignoreIfChildOf]);

  const mouseMove = useCallback((e: MouseEvent) => {
    const elem = ref.current;
    if (elem && mouseDown.current) {
      const isChildOfIgnored = ignoreIfChildOf?.current
        ? isChildOfElem({
          parent: ignoreIfChildOf?.current,
          child: e.target as HTMLElement,
        })
        : false;
      if (!isChildOfIgnored) {
        e.stopPropagation();
        e.preventDefault();
        if (!mouseDown.current) return;
        const x = e.pageX - elem.offsetLeft;
        const scroll = x - startX.current;
        elem.scrollLeft = scrollLeft.current - scroll;
      }
    }
  }, [ignoreIfChildOf, ref]);

  useEffect(() => {
    const elem = ref.current;
    if (elem) {
      elem.addEventListener('mousemove', mouseMove);
      elem.addEventListener('mousedown', onDragStart, false);
      elem.addEventListener('mouseup', onDragEnd, false);
      elem.addEventListener('mouseleave', onDragEnd, false);
    }
    return () => {
      if (elem) {
        elem.removeEventListener('mousemove', mouseMove);
        elem.removeEventListener('mousedown', onDragStart);
        elem.removeEventListener('mouseup', onDragEnd);
        elem.removeEventListener('mouseleave', onDragEnd);
      }
    };
  }, [
    mouseMove,
    onDragStart,
    onDragEnd,
    ref,
  ]);
};
