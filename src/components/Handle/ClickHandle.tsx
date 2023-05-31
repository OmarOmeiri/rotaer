import React from 'react';
import classes from './ClickHandle.module.css';

type Props = {
  isOpen: boolean
  bgColor?: string
  chevronColor?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  name: string,
  type: 'top' | 'bottom' | 'right' | 'left'
} & React.SVGAttributes<SVGSVGElement>

const ClickHandle = ({
  isOpen,
  bgColor,
  type,
  chevronColor,
  onClick,
  ...svgProps
}: Props) => {
  switch (type) {
    case 'top':
      return (
        <button onClick={onClick} className={classes.Btn}>
          <svg version="1.1" viewBox="0 0 55.228 13.036" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
            <g transform="translate(5.7556e-7 .033409)">
              <path transform="matrix(.26458 0 0 .26458 -4.9989e-7 -.033409)" d="m103.51 0v0.0019531l-103.51 0.125c0 1e-8 10.281 7.1698 19.115 17.514 8.8342 10.344 14.518 31.651 25.205 31.629l60.047-0.125 60.047 0.125c10.687 0.02192 16.369-21.285 25.203-31.629 8.8342-10.344 19.117-17.514 19.117-17.514l-103.52-0.125v-0.0019531l-0.85156 0.0019531z" fill={bgColor || '#e3e3e3'} strokeOpacity="0"/>
              <path className={`${isOpen ? classes.ChevronHidden : ''}`} d="m27.532 9.4205-5.5189-5.519c-0.26617-0.26617-0.26617-0.69771 0-0.96385l0.6437-0.6437c0.26572-0.26572 0.69637-0.26623 0.96272-0.00117l4.3945 4.3739 4.3944-4.3739c0.26634-0.26509 0.697-0.26458 0.96272 0.00117l0.6437 0.6437c0.26617 0.26617 0.26617 0.69771 0 0.96385l-5.5189 5.519c-0.26617 0.26615-0.69771 0.26615-0.96388 0z" fill={chevronColor || '#000'} strokeWidth=".028398"/>
              <path className={`${!isOpen ? classes.ChevronHidden : ''}`} d="m28.593 2.3028 5.5134 5.5134c0.2659 0.2659 0.2659 0.697 0 0.96288l-0.64304 0.64304c-0.26545 0.26545-0.69567 0.26596-0.96174 0.00113l-4.39-4.3694-4.39 4.3694c-0.26607 0.26483-0.69629 0.26432-0.96174-0.00113l-0.64304-0.64304c-0.2659-0.2659-0.2659-0.697 0-0.96288l5.5134-5.5134c0.26588-0.2659 0.69697-0.2659 0.96288-2.83e-5z" fill={chevronColor || '#000'} strokeWidth=".028369"/>
            </g>
          </svg>
        </button>
      );
    case 'bottom':
      return (
        <button onClick={onClick} className={classes.Btn}>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 207.9 49.1" {...svgProps}>
            <g transform="translate(5.7556e-7 .033409)">
              <path d="M104.4,49.2L104.4,49.2l103.5-0.1c0,0-10.3-7.2-19.1-17.5C180,21.3,174.3-0.1,163.6,0l-60,0.1L43.5,0c-10.7,0-16.4,21.3-25.2,31.6C9.5,41.9-0.8,49.1-0.8,49.1l103.5,0.1v0l0.9,0L104.4,49.2z" fill={bgColor || '#e3e3e3'}/>
              <path className={`${isOpen ? classes.ChevronHidden : ''}`} d="M103.9,13.5l20.9,20.9c1,1,1,2.6,0,3.6l-2.4,2.4c-1,1-2.6,1-3.6,0l-16.6-16.5L85.5,40.4c-1,1-2.6,1-3.6,0L79.4,38c-1-1-1-2.6,0-3.6l20.9-20.9C101.2,12.5,102.9,12.5,103.9,13.5L103.9,13.5z" fill={chevronColor || '#000'}/>
              <path className={`${!isOpen ? classes.ChevronHidden : ''}`} d="M99.9,40.4L79,19.6c-1-1-1-2.6,0-3.6l2.4-2.4c1-1,2.6-1,3.6,0L101.7,30l16.6-16.5c1-1,2.6-1,3.6,0l2.4,2.4c1,1,1,2.6,0,3.6l-20.8,20.8C102.5,41.4,100.9,41.4,99.9,40.4L99.9,40.4z" fill={chevronColor || '#000'}/>
            </g>
          </svg>
        </button>
      );
    case 'right':
      return (
        <button onClick={onClick} className={classes.Btn}>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.1 207.9" {...svgProps}>
            <g transform="translate(5.7556e-7 .033409)">
              <path className="st0" d="M49.3,103.5L49.3,103.5L49.1,0c0,0-7.2,10.3-17.5,19.1C21.3,27.9,0,33.6,0,44.3l0.1,60l-0.1,60c0,10.7,21.3,16.4,31.6,25.2c10.3,8.8,17.5,19.1,17.5,19.1l0.1-103.5h0l0-0.9L49.3,103.5z" fill={bgColor || '#e3e3e3'}/>
              <path className={`${isOpen ? classes.ChevronHidden : ''}`} d="M13.5,104l20.9-20.9c1-1,2.6-1,3.6,0l2.4,2.4c1,1,1,2.6,0,3.6l-16.5,16.6l16.5,16.6c1,1,1,2.6,0,3.6l-2.4,2.4c-1,1-2.6,1-3.6,0l-20.9-20.9C12.5,106.7,12.5,105,13.5,104L13.5,104z" fill={chevronColor || '#000'}/>
              <path className={`${!isOpen ? classes.ChevronHidden : ''}`} d="M40.4,108l-20.8,20.8c-1,1-2.6,1-3.6,0l-2.4-2.4c-1-1-1-2.6,0-3.6L30,106.2L13.5,89.6c-1-1-1-2.6,0-3.6l2.4-2.4c1-1,2.6-1,3.6,0l20.8,20.8C41.4,105.4,41.4,107,40.4,108L40.4,108z" fill={chevronColor || '#000'}/>
            </g>
          </svg>
        </button>
      );
    case 'left':
      return (
        <button onClick={onClick} className={classes.Btn}>
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.1 208.1" {...svgProps}>
            <g transform="translate(5.7556e-7 .033409)">
              <path className="st0" d="M-0.1,104.5L-0.1,104.5L0,208c0,0,7.2-10.3,17.5-19.1c10.3-8.8,31.6-14.5,31.6-25.2l-0.1-60l0.1-60c0-10.7-21.3-16.4-31.6-25.2C7.2,9.6,0-0.7,0-0.7l-0.1,103.5h0l0,0.9L-0.1,104.5z" fill={bgColor || '#e3e3e3'}/>
              <path className={`${isOpen ? classes.ChevronHidden : ''}`} d="M35.6,104l-20.9,20.9c-1,1-2.6,1-3.6,0l-2.4-2.4c-1-1-1-2.6,0-3.6l16.5-16.6L8.7,85.5c-1-1-1-2.6,0-3.6l2.4-2.4c1-1,2.6-1,3.6,0l20.9,20.9C36.6,101.3,36.6,103,35.6,104L35.6,104z" fill={chevronColor || '#000'}/>
              <path className={`${!isOpen ? classes.ChevronHidden : ''}`} d="M8.7,100l20.8-20.8c1-1,2.6-1,3.6,0l2.4,2.4c1,1,1,2.6,0,3.6l-16.5,16.6l16.5,16.6c1,1,1,2.6,0,3.6l-2.4,2.4c-1,1-2.6,1-3.6,0L8.7,103.6C7.7,102.6,7.7,101,8.7,100L8.7,100z" fill={chevronColor || '#000'}/>
            </g>
          </svg>
        </button>
      );
    default:
      return null;
  }
};

export default ClickHandle;
