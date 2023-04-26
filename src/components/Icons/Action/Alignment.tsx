import React from 'react';
import { ConditionalWrapper } from '@/utils/JSX';
import classes from './ActionIcons.module.css';
import alignmentIconClasses from './Alignment.module.css';

export interface AlignmentIconProps {
  alignment: React.CSSProperties['textAlign']
  btnId?: string,
  btnName?: string,
  size?: number,
  buttonStyle?: React.CSSProperties,
  className?: string,
  buttonClassName?: string,
  button?: boolean,
  style?: React.CSSProperties,
  extraProps?: {[key: string]: string}
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * @returns {JSX} Cog button
 */
const Alignment: React.FC<AlignmentIconProps> = ({
  alignment,
  btnId,
  btnName,
  size = 24,
  className,
  buttonClassName,
  buttonStyle,
  style,
  button,
  extraProps,
  onClick = () => {},
}) => {
  const getIcons = (
    alignment: React.CSSProperties['textAlign'],
  ) => {
    switch (alignment) {
      case 'center':
        return (
          <svg width={size} className={`${className} svg-icon`} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M108.1 88h231.81A12.09 12.09 0 0 0 352 75.9V52.09A12.09 12.09 0 0 0 339.91 40H108.1A12.09 12.09 0 0 0 96 52.09V75.9A12.1 12.1 0 0 0 108.1 88zM432 424H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0-256H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm-92.09 176A12.09 12.09 0 0 0 352 331.9v-23.81A12.09 12.09 0 0 0 339.91 296H108.1A12.09 12.09 0 0 0 96 308.09v23.81a12.1 12.1 0 0 0 12.1 12.1z" />
          </svg>
        );
      case 'left':
        return (
          <svg width={size} className={`${className} svg-icon`} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M12.83 344h262.34A12.82 12.82 0 0 0 288 331.17v-22.34A12.82 12.82 0 0 0 275.17 296H12.83A12.82 12.82 0 0 0 0 308.83v22.34A12.82 12.82 0 0 0 12.83 344zm0-256h262.34A12.82 12.82 0 0 0 288 75.17V52.83A12.82 12.82 0 0 0 275.17 40H12.83A12.82 12.82 0 0 0 0 52.83v22.34A12.82 12.82 0 0 0 12.83 88zM432 168H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16z" />
          </svg>
        );
      case 'right':
        return (
          <svg width={size} className={`${className} svg-icon`} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M16 216h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16zm416 208H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 52.83v22.34A12.82 12.82 0 0 0 172.83 88h262.34A12.82 12.82 0 0 0 448 75.17V52.83A12.82 12.82 0 0 0 435.17 40zm0 256H172.83A12.82 12.82 0 0 0 160 308.83v22.34A12.82 12.82 0 0 0 172.83 344h262.34A12.82 12.82 0 0 0 448 331.17v-22.34A12.82 12.82 0 0 0 435.17 296z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <ConditionalWrapper
      condition={!!button}
      wrapper={(children) => (
        <button
          data-id={btnId}
          data-name={btnName}
          type="button"
          style={{
            ...buttonStyle,
          }}
          onClick={onClick}
          className={`${classes.Btn} ${buttonClassName} ${alignmentIconClasses.Btn}`}
          {...extraProps}
        >
          {children}
        </button>
      )}
    >
      <>
        {getIcons(alignment)}
      </>
    </ConditionalWrapper>
  );
};

export default Alignment;
