'use client';

import { isEqual } from 'lodash';
import React, { useEffect } from 'react';
import { D3Margins } from '@frameworks/d3/Dimensions/types';
import { typedMemo } from '@utils/React/typedMemo';
import {
  D3ContextProvider,
  useD3Context,
} from '../context/D3Context';

const styles: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
};

const chartOverlayDivStyles: React.CSSProperties = {
  height: '100%',
  width: '100%',
  position: 'absolute',
  pointerEvents: 'none',
};

interface Props {
  children: React.ReactNode,
  margin?: Partial<D3Margins>
}

// eslint-disable-next-line require-jsdoc
export function withD3Context(Component: React.ElementType) {
  return function D3Component(props: Props) {
    return (
      <D3ContextProvider>
        <Component {...props}/>
      </D3ContextProvider>
    );
  };
}

const ReactD3Chart = typedMemo(withD3Context(({
  children,
  margin,
}: Props) => {
  const {
    setRef,
    setMargin,
  } = useD3Context();

  useEffect(() => {
    if (margin) {
      setMargin((state) => {
        if (isEqual(state, margin)) return state;
        return margin;
      });
    }
  }, [margin, setMargin]);

  return (
    <div style={styles}>
      <div ref={setRef} style={{ height: '100%', flexGrow: '1' }}/>
      {children}
    </div>
  );
}), (prev, next) => {
  if (!isEqual(prev.margin, next.margin)) return false;
  if (prev.children !== next.children) return false;
  return true;
});

(ReactD3Chart as React.FC).displayName = 'D3Chart';
export default ReactD3Chart;
