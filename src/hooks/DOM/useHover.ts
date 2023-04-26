import { useEffect, useRef, useState } from 'react';

/* eslint-disable require-jsdoc */
export const useHover = (): [ref: React.MutableRefObject<HTMLElement | null>, value: boolean] => {
  const [value, setValue] = useState(false);
  const ref = useRef<null | HTMLElement>(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [ref]);
  return [ref, value];
};

