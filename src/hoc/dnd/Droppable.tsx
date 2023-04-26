/* eslint-disable require-jsdoc */
import React, {
  useEffect,
  useImperativeHandle,
} from 'react';
import { useDroppable } from '@dnd-kit/core';

type Props = {
  children: JSX.Element
  onIsOver?: (isOver: boolean) => void
}

export const Droppable = ({
  onIsOver,
  children,
}: Props, ref?: React.LegacyRef<HTMLDivElement>) => {
  const { isOver, setNodeRef, node } = useDroppable({
    id: 'droppable',
  });
  useImperativeHandle(ref as React.Ref<HTMLInputElement>, () => node.current as HTMLInputElement);

  useEffect(() => {
    if (onIsOver) onIsOver(isOver);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver]);

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
};
