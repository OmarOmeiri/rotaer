import React from 'react';
import Config from '../../config';

export interface ISpinnerInfinityProps {
  width?: number,
  id?: string,
  divStyle?: React.CSSProperties,
  svgStyle?: React.CSSProperties
}

const SpinnerInfinity: React.FC<ISpinnerInfinityProps> = ({
  width = 267,
  id,
  divStyle,
  svgStyle,
}) => {
  const divStyled = {
    position: 'relative' as const,
    stroke: Config.get('styles').colors.green,
    ...divStyle,
  };

  const svgStyled = {
    position: 'absolute' as const,
    top: `calc(50% - ${width / 4}px)`,
    left: `calc(50% - ${width / 2}px)`,
    margin: 'auto',
    background: 'none',
    display: 'block',
    shapeRendering: 'auto' as const,
    ...svgStyle,
  };

  return (
    <div
      id={id}
      style={divStyled}
    >
      <svg
        style={svgStyled}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={`${width}px`}
        height={`${width / 2}px`}
        viewBox="0 25 100 48"
        preserveAspectRatio="xMidYMid"
      >
        <path className="loading-infinite" fill="none" strokeWidth="8" strokeDasharray="42.76482137044271 42.76482137044271" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" strokeLinecap="round" style={{ transform: 'scale(0.8)', transformOrigin: '50px 50px' }}>
          <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0;256.58892822265625" />
        </path>
      </svg>
    </div>
  );
};

export default SpinnerInfinity;
