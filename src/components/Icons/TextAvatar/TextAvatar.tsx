import Config from '@/config';

const { colors } = Config.get('styles');

export const TextAvatar = ({
  children,
  size,
  round,
  wrapperStyle,
  letterStyles,
  className,
}:{
  children: string,
  size: number | string,
  round?: boolean
  wrapperStyle?: React.CSSProperties,
  letterStyles?: React.CSSProperties
  className?: string,
}) => {
  const sizeValue = typeof size === 'number'
    ? `${size}px`
    : size;

  return (
    <div style={{
      width: sizeValue,
      height: sizeValue,
      minWidth: sizeValue,
      minHeight: sizeValue,
      overflow: 'hidden',
      borderRadius: round ? '50%' : '0',
    }} className={className || ''}>
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" version="1.1" preserveAspectRatio="xMidYMid meet">
        <rect fill="#ff0000" width="64" height="64" cx="32" cy="32" r="32" style={{ fill: colors.green, ...wrapperStyle }}/>
        <text x="50%" y="50%" style={{
          fill: colors.dark, ...letterStyles, fontWeight: 'bold', lineHeight: 1,
        }} alignmentBaseline="middle" textAnchor="middle" fontSize="26" fontWeight="400" dy=".1em" dominantBaseline="middle" fill="#ffffff">
          {children.charAt(0).toUpperCase()}
        </text>
      </svg>
    </div>
  );
};

