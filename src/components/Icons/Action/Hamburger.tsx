import React from 'react';
import classes from './Hamburger.module.css';

export interface IHamburgerButtonProps {
  height?: React.SVGAttributes<number>['height'],
  stroke?: React.SVGAttributes<number>['stroke'],
  strokeWidth?: React.SVGAttributes<number>['strokeWidth'],
  className?: string,
  onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void,
}

/**
 * @param {Number} height the height of the SVG
 * @param {String} stroke the stroke color
 * @param {Number} strokeWidth the storke width
 * @returns {JSX} hamburger button
 */
const HamburgerButton: React.FC<IHamburgerButtonProps> = ({
  height = 20,
  stroke = '#000',
  strokeWidth = 3,
  className,
  onClick,
}): JSX.Element => (
  <div role="button" className={`${className} ${classes.HamburgerButton}`} onClick={onClick} onKeyDown={onClick} tabIndex={0} aria-label="Menu">
    <svg height={height} version="1.1" viewBox="0 0 26.458 21.167" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke={stroke} strokeLinecap="round" strokeWidth={strokeWidth}>
        <path d="m3.4922 10.583h19.343" />
        <path d="m3.289 17.606h19.343" />
        <path d="m3.3567 3.5607h19.343" />
      </g>
    </svg>
  </div>
);

export default HamburgerButton;
