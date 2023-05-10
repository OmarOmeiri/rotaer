'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import { shallow } from 'zustand/shallow';
import Error from '@icons/exclamation.svg';
import Info from '@icons/info.svg';
import Success from '@icons/success.svg';
import Warning from '@icons/warning.svg';
import Portal from '@/hoc/portal/Portal';
import { useIsMouseInside } from '@/hooks/DOM/useIsMouseInside';
import { useDebounce } from '@/hooks/React/useDebounce';
import alertStore, {
  IAlertState,
  TAlertType,
} from '@/store/alert/alertStore';
import classes from './Alert.module.css';

const TIMEOUT = 500;

const Icon = ({ type }: {type?: TAlertType | null}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <Error/>;
      case 'warning':
        return <Warning/>;
      case 'success':
        return <Success/>;
      case 'info':
        return <Info/>;
      default:
        return null;
    }
  };
  return (
    <div style={{
      minWidth: '20px',
      maxWidth: '20px',
    }}>
      {getIcon()}
    </div>
  );
};

export const Alert = () => {
  const alertRef = useRef<HTMLDivElement | null>(null);
  const [mouseEventsEnabled, setMouseEventsEnabled] = useState(false);
  const alertPersist = useRef<IAlertState | null>(null);
  const {
    msg,
    timeout,
    type,
    id,
  } = alertStore((state) => ({
    msg: state.msg,
    timeout: state.timeout,
    type: state.type,
    id: state.id,
  }), shallow);

  let alertTypeClass = null;

  const [isMouseInside, setIsMouseInside] = useIsMouseInside(
    alertRef,
    50,
    mouseEventsEnabled,
  );

  useEffect(() => {
    if (id !== '') {
      setMouseEventsEnabled(true);
      alertPersist.current = {
        id,
        msg,
        timeout,
        type,
      };
    } else {
      setMouseEventsEnabled(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useDebounce(() => {
    if (!isMouseInside && alertRef.current) {
      alertRef.current.classList.remove(classes.AlertSeeThrough);
    }
  }, [isMouseInside], TIMEOUT);

  switch (alertPersist?.current?.type) {
    case 'error':
      alertTypeClass = classes.alertError;
      break;
    case 'warning':
      alertTypeClass = classes.alertWarning;
      break;
    case 'info':
      alertTypeClass = classes.alertInfo;
      break;
    case 'success':
      alertTypeClass = classes.alertSuccess;
      break;
    default:
      alertTypeClass = null;
      break;
  }

  const onEnter = () => {
    setIsMouseInside(true);
    if (alertRef.current) {
      alertRef.current.classList.add(classes.AlertSeeThrough);
    }
  };

  return (
    <Portal id="overlay-alert">
      <CSSTransition
        in={id !== ''}
        unmountOnExit
        timeout={{
          appear: 50,
          enter: 150,
          exit: 500,
        }}
        classNames={{
          enter: '',
          enterDone: classes.alertShow,
          exitActive: classes.alertShow,
          exitDone: classes.alertShow,
        }}
      >
        <div
          ref={alertRef}
          onMouseEnter={onEnter}
          className={`${classes.Alert} ${alertTypeClass}`}
        >
          <>
            <Icon type={alertPersist?.current?.type}/>
            <span>
              {alertPersist?.current?.msg}
            </span>
          </>
        </div>
      </CSSTransition>
    </Portal>
  );
};
