import React from 'react';

/**
 * Renders the bell icon with dynamic text fo the navbar
 * @param {Array} notifications
 * @returns
 */
const Bells = ({ fill }: {fill?: string}) => {
  const notifications = [];// useSelector((state) => state.notifications.notifications);

  let tSpanX = 346;
  let notifDisplay = null;
  if (notifications.length < 1) {
    notifDisplay = { display: 'none' };
  } else if (`${notifications.length}`.length > 1) {
    tSpanX -= 5;
  }
  // , 'shapeInside': 'url(#rect873)'
  return (
    <svg focusable="false" role="img" version="1.1" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
      <path fill={`${fill || 'currentColor'}`} d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"/>
      <g style={{ ...notifDisplay }} transform="matrix(1.5263 0 0 1.5263 -199.35 -207.08)">
        <path className="notification-bell" style={{ fill: 'red' }} d="m242.45 369.25a91.516 91.516 0 0 1 88.965-93.77 91.516 91.516 0 0 1 93.997 88.726 91.516 91.516 0 0 1-88.485 94.223 91.516 91.516 0 0 1-94.448-88.245" fill="#f00" strokeWidth="0" />
        <text transform="matrix(1.9818 0 0 2.1542 -357.47 -457.77)" x="68.46875" fill="#000000" fontFamily="sans-serif" fontSize="40px" style={{ lineHeight: '1.25', whiteSpace: 'pre' }} xmlSpace="preserve">
          <tspan x={tSpanX} y="406.83445">
            <tspan fill="#ffffff" fontSize="64px" textAnchor="middle">
              {notifications.length}
            </tspan>
          </tspan>
        </text>
      </g>
    </svg>
  );
};

export default Bells;
