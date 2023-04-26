/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable require-jsdoc */
import React, {
  useEffect,
  useRef,
} from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './Burgerlullo.module.css';

interface BurgerLulloProps {
  width?: number,
  className?: string,
  buttonClassName?: string,
  buttonStyle?: React.CSSProperties,
  buttonTitle?: string,
  style?: React.CSSProperties,
  button?: boolean,
  btnId?: string,
  onClick?: () => void
  isOpen?: boolean,
  secondaryFill?: string,
  secondaryFillOpacity?: string,
  mainFill?: string,
  mainFillOpacity?: string,
}

const BurgerLullo: React.FC<BurgerLulloProps> = ({
  width = 24,
  buttonClassName,
  className,
  buttonStyle,
  buttonTitle,
  style,
  button = true,
  btnId,
  secondaryFill,
  secondaryFillOpacity,
  mainFill,
  mainFillOpacity,
  onClick,
  isOpen,
}) => {
  const height = width * 0.77038005416;
  const greyPaths = useRef<null | SVGGElement>(null);
  const translateDownPaths = useRef<null | SVGGElement>(null);
  const rotatePositivePaths = useRef<null | SVGGElement>(null);
  const ScaleYPaths = useRef<null | SVGPathElement>(null);
  const translateUpPaths = useRef<null | SVGGElement>(null);
  const rotateNegativePaths = useRef<null | SVGGElement>(null);
  const ScaleYPath = useRef<null | SVGPathElement>(null);

  useEffect(() => {
    if (
      greyPaths.current
      && translateDownPaths.current
      && rotatePositivePaths.current
      && ScaleYPaths.current
      && translateUpPaths.current
      && rotateNegativePaths.current
      && ScaleYPath.current
    ) {
      if (isOpen) {
        greyPaths.current.classList.add(classes.ScaleY);
        greyPaths.current.classList.remove(classes.ScaleYInit);
        translateDownPaths.current.classList.add(classes.TranslateDown);
        translateDownPaths.current.classList.remove(classes.TranslateDownInit);
        rotatePositivePaths.current.classList.add(classes.RotatePositive);
        rotatePositivePaths.current.classList.remove(classes.RotatePositiveInit);
        ScaleYPaths.current.classList.add(classes.ScaleY);
        ScaleYPaths.current.classList.remove(classes.ScaleYInit);
        translateUpPaths.current.classList.add(classes.TranslateUp);
        translateUpPaths.current.classList.remove(classes.TranslateUpInit);
        rotateNegativePaths.current.classList.add(classes.RotateNegative);
        rotateNegativePaths.current.classList.remove(classes.RotateNegativeInit);
        ScaleYPath.current.classList.add(classes.ScaleY);
        ScaleYPath.current.classList.remove(classes.ScaleYInit);
      } else {
        greyPaths.current.classList.remove(classes.ScaleY);
        greyPaths.current.classList.add(classes.ScaleYInit);
        translateDownPaths.current.classList.remove(classes.TranslateDown);
        translateDownPaths.current.classList.add(classes.TranslateDownInit);
        rotatePositivePaths.current.classList.remove(classes.RotatePositive);
        rotatePositivePaths.current.classList.add(classes.RotatePositiveInit);
        ScaleYPaths.current.classList.remove(classes.ScaleY);
        ScaleYPaths.current.classList.add(classes.ScaleYInit);
        translateUpPaths.current.classList.remove(classes.TranslateUp);
        translateUpPaths.current.classList.add(classes.TranslateUpInit);
        rotateNegativePaths.current.classList.remove(classes.RotateNegative);
        rotateNegativePaths.current.classList.add(classes.RotateNegativeInit);
        ScaleYPath.current.classList.remove(classes.ScaleY);
        ScaleYPath.current.classList.add(classes.ScaleYInit);
      }
    }
  }, [isOpen]);

  return (
    <ConditionalWrapper
      condition={!!button}
      wrapper={(children) => (
        <button
          type="button"
          data-id={btnId}
          title={buttonTitle}
          style={{
            height: `${height}px`,
            width: `${width}px`,
            ...buttonStyle,
          }}
          onClick={onClick}
          className={`${classes.Btn} ${buttonClassName}`}
        >
          {children}
        </button>
      )}
    >
      <>

        <svg width={width} height={height} className={`${className} ${classes.Animate} burger-lullo`} style={style} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 214.18 165" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
          <g transform="matrix(1 0 0 1 93.16 -15.851)">
            <g ref={greyPaths} className={classes.ScaleYInit} fill={secondaryFill ?? 'rgb(0,0,0)'} fillOpacity={secondaryFillOpacity ?? '0.2545'}>
              <path d="M91.725,39.285C94.9607,39.285,97.5836,41.9079,97.5836,45.1436C97.5836,48.3789,94.9607,51.0018,91.725,51.0018L91.725,74.4358C107.903,74.4358,121.018,61.3208,121.018,45.1438C121.018,28.9668,107.903,15.8508,91.725,15.8508Z" transform="matrix(1 0 0 1 0 0.0002)" stroke="none" strokeWidth="0" strokeMiterlimit="1" />
              <path d="M-63.868,122.27C-79.979,122.3483,-93.017,135.426,-93.017,151.555C-93.017,167.732,-79.903,180.847,-63.725,180.847L-63.725,157.413C-66.9607,157.413,-69.5836,154.7901,-69.5836,151.5548C-69.5836,148.3188,-66.9607,145.6962,-63.725,145.6962L13.511,145.6962L13.511,122.2622L-63.868,122.2622Z" stroke="none" strokeWidth="0" strokeMiterlimit="1" />
              <path d="M-93.16,80.294C-93.16,96.472,-80.045,109.586,-63.867,109.586L13.512,109.586L13.512,86.152L-63.867,86.152C-67.103,86.152,-69.7256,83.5291,-69.7256,80.2934C-69.7256,77.0581,-67.103,74.4352,-63.867,74.4352L-63.867,51.0012C-80.045,51.0012,-93.16,64.1162,-93.16,80.2932" stroke="none" strokeWidth="0" strokeMiterlimit="1" />
            </g>
            <g fill={mainFill ?? 'rgb(62,58,105)'} fillOpacity={mainFillOpacity ?? 1}>
              <g ref={translateDownPaths} className={classes.TranslateDownInit} transform="translate(13.93,98.993706)">
                <g ref={rotatePositivePaths} className={classes.RotatePositiveInit} transform="rotate(0)">
                  <path d="M92.254,15.851L92.254,39.285L-63.996,39.285L-63.996,22.497C-63.996,18.8267,-61.0207,15.851,-57.35,15.851Z" transform="translate(-13.93,-98.993697)" stroke="none" strokeWidth="1" strokeMiterlimit="1" />
                </g>
              </g>
              <path ref={ScaleYPaths} className={classes.ScaleYInit} d="M92.254,51.002L92.254,74.436L-63.996,74.436L-63.996,51.002Z" transform="matrix(1 0 0 1 0 0.000209)" stroke="none" strokeWidth="1" strokeMiterlimit="1" />
              <g ref={translateUpPaths} className={classes.TranslateUpInit} transform="translate(14.129,169.12705)">
                <g ref={rotateNegativePaths} className={classes.RotateNegativeInit} transform="rotate(0)">
                  <path d="M92.254,157.41L92.254,173.736C92.254,177.6617,89.0716,180.8441,85.1459,180.8441L-63.9941,180.8441L-63.9941,157.4101Z" transform="translate(-14.32895,-169.12705)" stroke="none" strokeWidth="1" strokeMiterlimit="1" />
                </g>
              </g>
              <path ref={ScaleYPath} className={classes.ScaleYInit} d="M12.982,91.137L12.982,109.587L68.421,109.587L68.421,122.263L12.982,122.263L12.982,145.697L78.637,145.697C85.8644,145.697,91.724,139.8374,91.724,132.61L91.724,95.857C91.724,90.498,87.3795,86.1542,82.0208,86.1542L12.9818,86.1542Z" stroke="none" strokeWidth="1" strokeMiterlimit="1" />
            </g>
          </g>
        </svg>

      </>
    </ConditionalWrapper>
  );
};

export default BurgerLullo;
