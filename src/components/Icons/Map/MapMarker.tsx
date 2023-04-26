export const MapMarker = ({
  color = '#fa3232',
  size = 15,
}: {
  color?: string,
  size?: number
}) => (
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height={`${size}px`} width={`${size}px`} viewBox="0 0 50 50" xmlSpace="preserve">
    <g>
      <circle fill={color} cx="25" cy="25" r="22"/>
      <path d="M25,6c10.5,0,19,8.5,19,19s-8.5,19-19,19S6,35.5,6,25S14.5,6,25,6 M25,0C11.2,0,0,11.2,0,25s11.2,25,25,25s25-11.2,25-25
          S38.8,0,25,0L25,0z"/>
    </g>
  </svg>
);
