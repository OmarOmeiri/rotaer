import React, { Children, isValidElement } from 'react';

export const ReactChildrenMap = <T, R>(
  children: TypeOrArrayOfType<React.ReactElement<T, React.JSXElementConstructor<T>>>,
  cb: (child: React.ReactElement<T, React.JSXElementConstructor<T>>, i: number) => R,
) => (
    Children.map(children, (child, i) => {
      if (isValidElement(child)) {
        return (
          cb(child, i)
        );
      }
      throw new Error(`Child in not a valid element.${child}`);
    })
  );
