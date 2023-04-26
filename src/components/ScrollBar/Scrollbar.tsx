import { round } from 'lullo-utils/Math';
import React, {
  useCallback,
  useEffect,
  useRef,
} from 'react';
import styled from 'styled-components';
import uniqid from 'uniqid';
import { useResizeObserver } from '@/hooks/DOM/useResizeObserver';
import { useRefWithCallback } from '@/hooks/React/useRefWithCallback';
import { getPxFromCssDimensionString } from '@/utils/Styles/unitConvert';
import Config from '../../config';

const styles = Config.get('styles');

const Track = styled.div`
width: ${styles.scrollBar.width}px;
background-color: ${styles.scrollBar.track.bg};
position: absolute;
z-index: 1;
right: 0;
& .scrbr-thumb {
  background-color: ${styles.scrollBar.thumb.bg};
  border-radius: ${styles.scrollBar.thumb.borderRadius}px;
  border: ${styles.scrollBar.thumb.border};
  position: relative;
  cursor: pointer;
}`;

const ScrollBar = ({
  elm,
  wrapperStyle,
  thumbStyle,
}: {
  elm: React.MutableRefObject<HTMLElement | null>
  wrapperStyle?: React.CSSProperties,
  thumbStyle?: React.CSSProperties
}) => {
  const thumb = useRef<HTMLDivElement | null>(null);
  const isThumbClicked = useRef(false);
  const ignoreScrollEvents = useRef(false);
  const parentRef = useRef<HTMLElement | null>(null);
  const clickStart = useRef<number | null>(null);
  const trackHeightStart = useRef<number | null>(null);
  const thumbTopStart = useRef<number | null>(null);
  const scrollTopStart = useRef<number | null>(null);
  const [ref, setRef] = useRefWithCallback<HTMLDivElement | null>((node) => {
    const parent = node?.parentElement;
    const thumb = node?.firstElementChild as HTMLElement | null;
    if (node && parent && thumb) {
      const { id } = parent;
      if (!id) parent.setAttribute('id', uniqid());
      parentRef.current = parent;
      const { scrollHeight, offsetHeight } = parent;
      node.style.height = `${offsetHeight}px`;
      const visibleRatio = Math.min(offsetHeight / scrollHeight, 1);
      const thumbHeight = offsetHeight * visibleRatio;
      thumb.style.height = `${thumbHeight}px`;
    }
  });

  const resizeCallback = useCallback((entry: ResizeObserverEntry) => {
    const target = entry.target as HTMLElement;
    const visibleRatio = round(Math.min(target.offsetHeight / target.scrollHeight, 1), 2);
    if (ref.current) {
      if (visibleRatio >= 0.99) {
        ref.current.style.display = 'none';
      } else {
        ref.current.style.removeProperty('display');
      }
    }
  }, [ref]);

  useResizeObserver({
    element: parentRef,
    callback: resizeCallback,
    delay: 100,
  });

  const scrollHandler = useCallback(() => {
    if (elm.current && thumb.current && ref.current && !ignoreScrollEvents.current) {
      const { scrollTop, scrollHeight, offsetHeight } = elm.current;
      const scrolledPercent = (scrollTop) / (scrollHeight - offsetHeight);
      const thumbTop = (ref.current.offsetHeight - thumb.current.offsetHeight) * scrolledPercent;
      thumb.current.style.top = `${thumbTop}px`;
    }
  }, [elm, ref]);

  const mouseUpHandler = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isThumbClicked.current = false;
    clickStart.current = null;
    ignoreScrollEvents.current = false;
    scrollTopStart.current = null;
    trackHeightStart.current = null;
    thumbTopStart.current = null;
  }, []);

  const mouseDownHandler = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (ref.current) {
      isThumbClicked.current = true;
      trackHeightStart.current = ref.current.offsetHeight;
      document.addEventListener('mouseup', mouseUpHandler, { once: true });
    }
  }, [mouseUpHandler, ref]);

  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    if (isThumbClicked.current) {
      const y = e.clientY;
      if (clickStart.current === null) clickStart.current = y;

      if (
        clickStart.current !== null
        && elm.current
        && thumb.current
        && ref.current
        && trackHeightStart.current
      ) {
        ignoreScrollEvents.current = true;
        const { scrollTop, scrollHeight } = elm.current;
        if (scrollTopStart.current === null) scrollTopStart.current = scrollTop;
        if (thumbTopStart.current === null) {
          const currentThumbTop = getPxFromCssDimensionString(thumb.current.style.top);
          thumbTopStart.current = currentThumbTop;
        }
        if (scrollTopStart.current !== null && thumbTopStart.current !== null) {
          const thumbYDistance = y - clickStart.current;
          const trackbToElementRatio = scrollHeight / ref.current.offsetHeight;
          const elementDistance = thumbYDistance * trackbToElementRatio;
          elm.current.scrollTop = scrollTopStart.current + elementDistance;
          const thumbTop = Math.min(
            Math.max(
              thumbTopStart.current + thumbYDistance,
              0,
            ),
            trackHeightStart.current - thumb.current.scrollHeight - 2,
          );

          thumb.current.style.top = `${thumbTop}px`;
        }
      }
    }
  }, [elm, ref]);

  useEffect(() => {
    const element = elm.current;
    if (element) {
      element.addEventListener('scroll', scrollHandler);
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', scrollHandler);
      }
    };
  }, [elm, scrollHandler]);

  useEffect(() => {
    const thumbElement = thumb.current;
    if (thumbElement) {
      thumbElement.addEventListener('mousedown', mouseDownHandler);
      document.addEventListener('mousemove', mouseMoveHandler);
    }
    return () => {
      if (thumbElement) {
        thumbElement.removeEventListener('mousedown', mouseDownHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
      }
    };
  }, [thumb, mouseDownHandler, mouseUpHandler, mouseMoveHandler]);

  return (
    <Track ref={setRef} style={wrapperStyle}>
      <div className="scrbr-thumb" ref={thumb} style={thumbStyle}/>
    </Track>
  );
};

export default ScrollBar;
