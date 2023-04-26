import React, { useRef } from 'react';
import classes from './Bubbles.module.css';

export interface IBubblesIconProps {
  size?: React.SVGAttributes<number>['width'],
  strokeWidth?: React.SVGAttributes<number>['strokeWidth'],
  style?: React.CSSProperties,
  id: string,
  strokeColor?: React.SVGAttributes<number>['stroke'],
  onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
  onBlur?: (e: React.FocusEvent) => void
}

const BubblesSVG: React.FC<IBubblesIconProps> = ({
  size = 13,
  strokeWidth = 7,
  style,
  id,
  strokeColor,
  onClick = () => {},
  onBlur = () => {},
}) => {
  const bubbleSm = useRef<SVGEllipseElement | null>(null);
  const bubbleMd = useRef<SVGEllipseElement | null>(null);
  const bubbleLg = useRef<SVGEllipseElement | null>(null);

  /**
   * Animates bubbles on click
   */
  function animate(e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) {
    try {
      if (
        bubbleLg.current
        && bubbleMd.current
        && bubbleSm.current
      ) {
        bubbleLg.current.classList.add(classes.BubbleOffLg);
        bubbleMd.current.classList.add(classes.BubbleOffMd);
        bubbleSm.current.classList.add(classes.BubbleOffSm);
      }
      onClick(e);
      setTimeout(() => {
        if (
          bubbleLg.current
          && bubbleMd.current
          && bubbleSm.current
        ) {
          bubbleLg.current.classList.remove(classes.BubbleOffLg);
          bubbleMd.current.classList.remove(classes.BubbleOffMd);
          bubbleSm.current.classList.remove(classes.BubbleOffSm);
        }
      }, 2700);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div
      id={id}
      style={{ cursor: 'pointer', ...style }}
      className="action-btn"
      onClick={animate}
      role="button"
      tabIndex={-1}
      onKeyDown={animate}
      onBlur={onBlur}
    >
      <svg
        className="bubbles-svg"
        style={{ pointerEvents: 'none', overflow: 'visible' }}
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 80"
      >
        <g>
          <title>Layer 1</title>
          <ellipse
            ref={bubbleLg}
            ry="13.35503"
            rx="13.5179"
            cy="19.37027"
            cx="27.99023"
            strokeWidth={strokeWidth}
            stroke={strokeColor ?? 'var(--mainPlatformColor)'}
            fill="none"
          />
          <ellipse
            ref={bubbleMd}
            stroke={strokeColor ?? 'var(--mainPlatformColor)'}
            ry="9.44624"
            rx="9.52768"
            cy="48.1976"
            cx="16.18242"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <ellipse
            ref={bubbleSm}
            ry="6.51465"
            rx="6.27035"
            cy="68.06729"
            cx="32"
            strokeWidth={strokeWidth}
            stroke={strokeColor ?? 'var(--mainPlatformColor)'}
            fill="none"
          />
        </g>
      </svg>
    </div>

  );
};

export default BubblesSVG;
