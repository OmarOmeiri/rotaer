/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';

export type ILoadImgWithFallbackProps = {
  url?: string,
  alt?: string,
  fallback: string | React.ReactElement
  style?: React.CSSProperties,
  className?: string,
}

const LoadImgWithFallback: React.FC<ILoadImgWithFallbackProps> = ({
  url,
  alt,
  fallback,
  style,
  className,
}) => {
  const [fall, setFall] = useState<boolean>(false);
  useEffect(() => {
    if (!url) {
      setFall(true);
    } else {
      setFall(false);
    }
  }, [url]);

  const onError = () => {
    setFall(true);
  };

  if (!fall) {
    return (
      <img src={url} className={className} style={style} alt={alt ?? ''} onError={onError} />
    );
  }

  if (typeof fallback === 'string') {
    return <img src={url} className={className} style={style} alt={alt} />;
  }
  return (
    <>
      {fallback}
    </>
  );
};

export default LoadImgWithFallback;
