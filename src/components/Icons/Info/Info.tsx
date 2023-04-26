import React, { useRef } from 'react';
import classes from './Info.module.css';

export interface IInfoIconProps {
  size?: React.SVGAttributes<number>['width'],
  style?: React.CSSProperties,
  id: string,
  important?: boolean,
  onClick: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
  onBlur: (e: React.FocusEvent) => void
}

const InfoSVG: React.FC<IInfoIconProps> = ({
  size = 20,
  style,
  id,
  important,
  onClick,
  onBlur,
}) => {
  const infoSvg = useRef<SVGSVGElement | null>(null);

  /**
   * Animates bubbles on hover
   */
  function animate(e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) {
    try {
      if (infoSvg.current) {
        infoSvg.current.classList.add(classes.InfoAnim);
        infoSvg.current.focus();
      }
      onClick(e);
      setTimeout(() => {
        if (infoSvg.current) infoSvg.current.classList.remove(classes.InfoAnim);
      }, 500);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      id={id}
      style={{ cursor: 'pointer', ...style }}
      className={`${important ? `info-btn-important ${classes.InfoImportant}` : null} action-btn info-btn ${classes.InfoBtn} ${classes.Focus}`}
      onClick={animate}
      role="button"
      tabIndex={-1}
      onKeyDown={animate}
      onBlur={onBlur}
    >
      <svg
        width={size}
        ref={infoSvg}
        style={{ pointerEvents: 'none', overflow: 'visible' }}
        version="1.1"
        viewBox="0 0 27.662 27.772"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(-83.897 -57.6)" stroke="#000">
          <path
            d="m85.254 71.799a12.478 12.533 0 0 1 12.13-12.841 12.478 12.533 0 0 1 12.816 12.151 12.478 12.533 0 0 1-12.065 12.904 12.478 12.533 0 0 1-12.878-12.085"
            fillOpacity=".0067568"
            strokeLinecap="round"
            strokeMiterlimit="4.8"
            strokeWidth="2.7058"
          />
          <path
            d="m97.211 66.131a0.50228 0.4886 0 0 1 0.48828-0.50063 0.50228 0.4886 0 0 1 0.51589 0.4737 0.50228 0.4886 0 0 1-0.48564 0.50305 0.50228 0.4886 0 0 1-0.51837-0.47113"
            strokeLinecap="round"
            strokeMiterlimit="4.8"
            strokeWidth="3.707"
          />
          <path
            d="m94.69 78.875v-3.2072h1.2361v-3.1404h-1.2946v-3.1885h5.5373v6.337h1.1812v3.1824z"
            strokeLinejoin="round"
            strokeWidth=".465"
            style={{ paintOrder: 'normal' }}
          />
        </g>
      </svg>
    </div>

  );
};

export default InfoSVG;
