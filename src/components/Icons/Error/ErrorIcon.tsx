import React from 'react';

export interface IErrorIconProps {
  width?: number,
  id?: string,
  divStyle?: React.CSSProperties,
  svgStyle?: React.CSSProperties,
  message?: string
}

const ErrorIcon = ({
  width = 267,
  id,
  divStyle,
  svgStyle,
  message = 'Houve um erro inesperado.',
}: IErrorIconProps) => {
  const divStyled = {
    position: 'relative' as const,
    ...divStyle,
  };

  const svgStyled = {
    margin: 'auto',
    background: 'none',
    display: 'block',
    shapeRendering: 'auto' as const,
    ...svgStyle,
  };

  const lineStyle: React.CSSProperties = {
    fill: 'none',
    stroke: '#FFFFFF',
    strokeWidth: '7',
    strokeLinecap: 'round',
    strokeMiterlimit: '10',
  };

  return (
    <div
      id={id}
      style={divStyled}
    >
      <div style={{
        position: 'absolute' as const,
        top: `calc(50% - ${width / 4}px)`,
        left: `calc(50% - ${width / 2}px)`,
        textAlign: 'center',
      }}>
        <svg
          width={`${width}px`}
          height={`${width / 2}px`}
          style={svgStyled}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 50 50"
          xmlSpace="preserve">
          <g>
            <circle style={{ fill: '#ED1C24' }} cx="25" cy="25" r="25"/>
          </g>
          <line style={lineStyle} x1="13" y1="37" x2="37" y2="13"/>
          <line style={lineStyle} x1="37" y1="37" x2="13" y2="13"/>
        </svg>
        <p>
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorIcon;
