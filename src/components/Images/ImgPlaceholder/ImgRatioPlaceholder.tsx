import React from 'react';
import classes from './ImgRatioPlaceholder.module.css';

interface IImgRatioPlaceholder {
  aspectRatio: string,
  style?: React.CSSProperties,
  svgStyle?: React.CSSProperties,
  className?: string,
  children: React.ReactNode;
}

const ImgRatioPlaceholder: React.FC<IImgRatioPlaceholder> = ({
  aspectRatio,
  style,
  svgStyle,
  children,
  className,
}) => (
  <div className={`${classes.Ratio} ${className}`} style={style}>
    <svg style={svgStyle} viewBox={`0 0 ${aspectRatio.split(':')[0]} ${aspectRatio.split(':')[1]}`} />
    {children}
  </div>
);

export default ImgRatioPlaceholder;
