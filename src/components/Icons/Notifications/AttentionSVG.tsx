import React from 'react';

interface IAttentionIconProps {
  size?: number,
  top?: number,
  left?: number,
  position?: React.CSSProperties['position'],
  display?: React.CSSProperties['display'],
  id?: string,
}

const AttentionSvg: React.FC<IAttentionIconProps> = ({
  size = 267,
  top = 0,
  left = 0,
  position = 'absolute',
  display = 'block',
  id = undefined,
}) => {
  let topOffset = size / 2;
  let leftOffset = size / 2;
  if (top !== 0) {
    topOffset -= top;
  }
  if (left !== 0) {
    leftOffset -= left;
  }

  let divTop = '';
  let divLeft = '';
  if (position === 'fixed' || position === 'absolute') {
    divTop = `calc(50% - ${topOffset}px)`;
    divLeft = `calc(50% - ${leftOffset}px)`;
  } else {
    divTop = `${top}`;
    divLeft = `${left}`;
  }

  return (
    <div
      id={id}
      style={{
        position,
        top: divTop,
        left: divLeft,
        display,
      }}
    >
      <svg
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 451.74 451.74"
        style={{
          margin: 'auto',
          background: 'none',
          display: 'block',
          shapeRendering: 'auto',
          // @ts-ignore
          enableBackground: 'new 0 0 451.74 451.74',
        }}
        width={`${size}px`}
        height={`${size}px`}
        xmlSpace="preserve"
      >
        <path style={{ fill: '#E24C4B' }} d="M446.324,367.381L262.857,41.692c-15.644-28.444-58.311-28.444-73.956,0L5.435,367.381c-15.644,28.444,4.267,64,36.978,64h365.511C442.057,429.959,461.968,395.825,446.324,367.381z" />
        <path style={{ fill: '#FFFFFF' }} d="M225.879,63.025l183.467,325.689H42.413L225.879,63.025L225.879,63.025z" />
        <g>
          <path style={{ fill: '#3F4448' }} d="M196.013,212.359l11.378,75.378c1.422,8.533,8.533,15.644,18.489,15.644l0,0c8.533,0,17.067-7.111,18.489-15.644l11.378-75.378c2.844-18.489-11.378-34.133-29.867-34.133l0,0C207.39,178.225,194.59,193.87,196.013,212.359z" />
          <circle style={{ fill: '#3F4448' }} cx="225.879" cy="336.092" r="17.067" />
        </g>
      </svg>
    </div>
  );
};

export default AttentionSvg;
