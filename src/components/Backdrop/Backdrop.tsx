import React, { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import classes from './Backdrop.module.css';

interface IBackdropProps {
  show: boolean,
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void,
  children?: JSX.Element,
}

/**
 *
 * @param {*} param0
 * @returns
 */
const Backdrop: React.FC<IBackdropProps> = ({
  show,
  onClick = () => {},
  children,
}) => {
  const backdropRef = useRef(null);
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.removeProperty('overflow');
    }
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [show]);
  return (
    <CSSTransition
      in={show}
      timeout={{
        appear: 0,
        enter: 500,
        exit: 100,
      }}
      mountOnEnter
      unmountOnExit
      classNames={{
        enter: classes.BackdropEnter,
        enterDone: classes.BackdropEnter,
        exitActive: classes.BackdropLeave,
        exitDone: classes.BackdropLeave,
      }}
      nodeRef={backdropRef}
    >
      <div
        ref={backdropRef}
        role="button"
        aria-label="Fechar"
        className={`${classes.Backdrop}`}
        onClick={onClick}
        onKeyDown={onClick}
        tabIndex={0}
      >
        {children}
      </div>
    </CSSTransition>
  );
};

export default Backdrop;
