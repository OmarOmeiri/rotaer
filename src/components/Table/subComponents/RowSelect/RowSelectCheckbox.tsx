import React, { HTMLProps, useCallback } from 'react';
import classes from './RowSelect.module.css';

export const RowSelectCheckbox = ({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, indeterminate]);

  const onMouseUp = useCallback((e : React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`${className} ${classes.RowSelectCheckboc}`}
      {...rest}
      onMouseUp={onMouseUp}
    />
  );
};
