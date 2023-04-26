/* eslint-disable import/no-anonymous-default-export */
import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';

interface Props {
  children: React.ReactElement,
  handleRef: React.MutableRefObject<HTMLElement | null>
}

const Draggable = forwardRef(({
  children,
  handleRef,
}: Props, fwdRef: React.ForwardedRef<HTMLElement>): JSX.Element => {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(fwdRef, () => ref.current as HTMLInputElement);
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    if (!ref.current || !handleRef.current) {
      setReRender((val) => val !== true);
    } else {
      const dragElement = (el: HTMLElement, handle: HTMLElement) => {
        let pos1 = 0;
        let pos2 = 0;
        let pos3 = 0;
        let pos4 = 0;
        const dragMouseDown = (e: MouseEvent) => {
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        };

        const elementDrag = (e: MouseEvent) => {
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          el.style.top = `${el.offsetTop - pos2}px`;
          el.style.left = `${el.offsetLeft - pos1}px`;
        };

        const closeDragElement = () => {
          document.onmouseup = null;
          document.onmousemove = null;
        };

        handle.onmousedown = dragMouseDown;
      };

      dragElement(ref.current, handleRef.current);
    }
  }, [reRender, handleRef]);

  return React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      ref.current = node;
    },
  });
});

export default Draggable;
