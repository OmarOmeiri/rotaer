/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable require-jsdoc */
import React, {
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import Config from '../../../config';
import classes from './BurgerLulloSm.module.css';

const burgerColor = Config.get('styles').colors.lightGreen;

type BurgerLulloProps = {
  width?: undefined,
  height?: undefined,
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
  backgroundColor: string,
} | {
  width: number,
  height?: undefined,
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
  backgroundColor: string,
} | {
  width?: undefined,
  height: number,
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
  backgroundColor: string,
}

const BurgerLulloSmFwdRef: React.ForwardRefRenderFunction<HTMLButtonElement, BurgerLulloProps> = ({
  width,
  height,
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
}, ref?: React.ForwardedRef<HTMLButtonElement>) => {
  if (!width && !height) width = 24;
  if (!width && height) width = height * 1.632814971935;
  if (width && !height) height = width * 0.612439264208;

  const svgRef = useRef<null | SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      if (isOpen) svgRef.current.classList.add(classes.Animate);
      else svgRef.current.classList.remove(classes.Animate);
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
          ref={ref}
          onClick={onClick}
          className={`${classes.Btn} ${buttonClassName}`}
        >
          {children}
        </button>
      )}
    >
      <>
        <svg width={width} height={height} ref={svgRef} className={`${className} ${classes.Burger} burger-lullo`} style={style} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 220.61 143.74" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
          <g transform="matrix(1.3333 0 0 -1.3333 -429.94 470.8)">
            <g
              stroke="none"
              strokeWidth="0"
              strokeMiterlimit="1"
              fill={secondaryFill ?? burgerColor}
              fillOpacity={secondaryFillOpacity ?? '0.2545'}
              className={classes.Sweeps}
            >
              <g className={classes.SweepLeft}>
                <path
                  d="M362.89,313.39L362.89,285.001L352.952,285.001L352.952,284.998C349.904469,284.952338,347.457538,282.428316,347.4576,279.3305C347.457872,276.200464,349.954338,273.663168,353.0339,273.663L353.0339,273.665L362.8899,273.665L362.8899,245.297L355.4223,245.297C337.216071,245.29757,322.4573,260.540317,322.4573,279.343C322.457241,298.11226,337.165494,313.341174,355.3393,313.389L355.3393,313.39Z"
                  transform="translate(-342.673676,-279.343513)"
                />
              </g>
              <g className={classes.SweepRight}>
                <path
                  d="M447.48,353.1L447.48,324.711L457.418,324.711L457.418,324.708C460.465531,324.662338,462.912462,322.138316,462.9124,319.0405C462.912128,315.910464,460.415662,313.373168,457.3361,313.373L457.3361,313.375L447.4801,313.375L447.4801,285.007L454.9477,285.007C473.153929,285.00757,487.9127,300.250317,487.9127,319.053C487.912759,337.82226,473.204506,353.051174,455.0307,353.099L455.0307,353.1Z"
                  transform="translate(-467.696365,-319.053497)"
                />
              </g>
            </g>
            <g
              fill={mainFill ?? burgerColor}
              fillOpacity={mainFillOpacity ?? 1}
              stroke="none"
              strokeWidth="0"
              strokeMiterlimit="1"
            >
              <g className={classes.BarTop}>
                <path
                  d="M54.102,0.4707C47.338408,0.503354,41.100828,4.107695,37.719,9.9375C34.319916,15.796208,34.319916,23.014792,37.719,28.8735C41.099898,34.700089,47.333683,38.303236,54.094,38.3383L54.094,38.3403L167.564,38.3403L167.564,38.28366C174.313055,38.259913,180.544247,34.679042,183.939,28.87346C187.338084,23.014752,187.338084,15.796168,183.939,9.93746C180.544247,4.131878,174.313055,0.551007,167.564,0.52726L167.564,0.472572L167.4683,0.472572C167.466967,0.471921,167.465633,0.47127,167.4643,0.470619L167.4643,0.472572L54.1943,0.472572L54.1943,0.470619C54.1637,0.470546,54.1331,0.470546,54.1025,0.470619Z"
                  transform="translate(0,0)"
                />
              </g>
              <g className={classes.BarMiddle} transform="translate(405.193879,299.195912) rotate(-180) scale(-0.75,0.75)">
                <path
                  d="M54.102,53.404C47.338408,53.436654,41.100828,57.040995,37.719,62.8708C34.32069,68.729,34.32069,75.9466,37.719,81.8048C41.099389,87.632159,47.33327,91.236122,54.094,91.2716L54.094,91.2736L167.564,91.2736L167.564,91.21696C174.313446,91.192819,180.544728,87.611173,183.939,81.80486C187.33731,75.94666,187.33731,68.72906,183.939,62.87086C180.544247,57.065278,174.313055,53.484407,167.564,53.46066L167.564,53.40597L167.4683,53.40597C167.466967,53.405303,167.465633,53.404637,167.4643,53.40397L167.4643,53.40597L54.1943,53.40597L54.1943,53.40397C54.1637,53.403897,54.1331,53.403897,54.1025,53.40397Z"
                  transform="translate(-110.828999,-72.338784)"
                />
              </g>
              <g className={classes.BarBottom}>
                <path
                  id="eR5nshbLMUE9"
                  d="M54.102,106.34C47.338408,106.372654,41.100828,109.976995,37.719,115.8068C34.32069,121.665,34.32069,128.8826,37.719,134.7408C41.099389,140.568159,47.33327,144.172122,54.094,144.2076C54.127203,144.207687,54.160407,144.207687,54.19361,144.2076L167.56361,144.2076L167.56361,144.151C174.312665,144.127253,180.543857,140.546382,183.93861,134.7408C187.33692,128.8826,187.33692,121.665,183.93861,115.8068C180.543857,110.001218,174.312665,106.420347,167.56361,106.3966L167.56361,106.3419L167.46791,106.3419C167.466577,106.341233,167.465243,106.340567,167.46391,106.3399L167.46391,106.3419L54.19391,106.3419L54.19391,106.3399C54.16331,106.339827,54.13271,106.339827,54.10211,106.3399Z"
                  transform="translate(-110.8288,-125.273749)"
                />
              </g>
            </g>
          </g>
        </svg>

      </>
    </ConditionalWrapper>
  );
};

const BurgerLulloSm = forwardRef(BurgerLulloSmFwdRef);

export default BurgerLulloSm;
