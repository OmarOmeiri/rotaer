import { useQuery } from '@tanstack/react-query';
import React from 'react';

export type LazyImportSVGProps = {
  path: string,
  fullPath?: undefined
  style?: React.CSSProperties,
  className?: string,
  fallback?: React.ReactElement
} | {
  path?: undefined,
  fullPath: string
  style?: React.CSSProperties,
  className?: string,
  fallback?: React.ReactElement
}

const LazyImportSVG: React.FC<LazyImportSVGProps> = ({
  path,
  fullPath,
  style,
  className,
  fallback = null,
}) => {
  const query = useQuery([path, fullPath], async () => {
    try {
      if (fullPath) {
        const icon = await import(`public/assets/${fullPath}`);
        return icon.default as unknown as React.JSXElementConstructor<any>;
      }
      const icon = await import(`public/assets/icons/${path}`);
      return icon.default as unknown as React.JSXElementConstructor<any>;
    } catch {
      return null;
    }
  }, {
    cacheTime: Infinity,
    staleTime: Infinity,
    enabled: !!(path || fullPath),
  });

  if (query.data) {
    const SVG = query.data;
    return (
      <div style={{ display: 'flex', ...style }} className={className}>
        <SVG />
      </div>
    );
  }

  return fallback;
};

export default LazyImportSVG;
