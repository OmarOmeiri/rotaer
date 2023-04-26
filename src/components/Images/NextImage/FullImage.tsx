import Image, { ImageProps } from 'next/image';
import React from 'react';
import classes from './FullImage.module.scss';

export type FullImageProps = {
  src: ImageProps['src']
  alt: string
  type: 'width' | 'height'
}

const FullImage: React.FC<FullImageProps> = ({
  src,
  alt,
  type,
}) => (
  <div className={`${classes.Container} ${type === 'width' ? classes.FullWidth : classes.FullHeight}`}>
    <Image src={src} className={classes.Image} alt={alt} fill sizes="100vw" />
  </div>
);

export default FullImage;
