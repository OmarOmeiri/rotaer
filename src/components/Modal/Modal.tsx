import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  CSSTransition,
  SwitchTransition,
} from 'react-transition-group';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';
import Backdrop from '@/components/Backdrop/Backdrop';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import Config from '@/config';
import Portal from '@/hoc/portal/Portal';
import { useResizeObserver } from '@/hooks/DOM/useResizeObserver';
import { useSyncStateRef } from '@/hooks/React/useSyncStateRef';
import modalStore from '@/store/modal/modalStore';
import {
  allModals,
  modalChildProps,
} from '@/store/modal/typings';
import { vh } from '@/utils/HTML/htmlPosition';
import X from '../Icons/Action/X';
import Left from '../Icons/Order/ChevronLeft';
import classes from './Modal.module.scss';
import { IModalProps } from './typings';

// import useRenderingTrace from '@customHooks/useRenderingTrace';

const modalStyles = Config.get('styles').modal;

const getModalStyle = (modalName: allModals | null, modalStyle: IModalProps['modalStyle'] | undefined): IModalProps['modalStyle'] => {
  const preConfiguredStyle = modalName ? modalStyles[modalName] : undefined;

  return {
    wrapperStyle: {
      ...preConfiguredStyle?.wrapperStyle,
      ...modalStyle?.wrapperStyle,
    },
    modalInnerStyle: {
      ...preConfiguredStyle?.modalInnerStyle,
      ...modalStyle?.modalInnerStyle,
    },
    modalOuterStyle: {
      ...preConfiguredStyle?.modalOuterStyle,
      ...modalStyle?.modalOuterStyle,
    },
    closeBtn: {
      ...preConfiguredStyle?.closeBtn,
      ...modalStyle?.closeBtn,
    },
  };
};

type CloseBtnProps = Exclude<Exclude<IModalProps['modalStyle'], undefined>['closeBtn'], undefined>

const CloseBtn = styled(X)`
& *{
  fill: ${(props: CloseBtnProps) => props?.color || 'red'};
  stroke: ${(props: CloseBtnProps) => props?.color || 'red'};
}

&:hover *{
  fill: ${(props: CloseBtnProps) => props?.hoverColor || 'red'};
  stroke: ${(props: CloseBtnProps) => props?.hoverColor || 'red'};
}
`;

/**
 * General modal PopUp
 * @param {JSX} children any modal content
 * @returns {Component} the modal PopUp
 */
const Modal = ({
  show,
  modalContent,
  loading,
  children,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeModalClose = () => {},
  modalStyle,
}: IModalProps) => {
  const {
    closeModal,
    setModalContent,
  } = modalStore((state) => ({
    closeModal: state.closeModal,
    setModalContent: state.setModalContent,
  }), shallow);

  const {
    wrapperStyle,
    modalInnerStyle,
    modalOuterStyle,
    closeBtn,
  } = getModalStyle(modalContent.name, modalStyle) ?? {
    wrapperStyle: undefined,
    modalInnerStyle: undefined,
    modalOuterStyle: undefined,
    closeBtn: undefined,
  };

  const [modalHeight, setModalHeight] = useState<number>(0);
  const modalInner = useRef<null | HTMLDivElement>(null);
  const modalOuterWrapper = useRef<null | HTMLDivElement>(null);
  const [modalOverflowHidden, setModalOverflowHidden] = useState<boolean>(true);
  const [firstEnter, setFirstEnter] = useSyncStateRef<boolean>({ value: true });
  const [exitClass, setExitClass] = useSyncStateRef<string>({ value: 'init' });
  const [modalContentHistory, setModalContentHistory] = useState<allModals[]>([]);
  const [modalPropsHistory, setModalPropsHistory] = useState<(modalChildProps<allModals>)[]>([]);
  const backBtn = useRef<HTMLButtonElement | null>(null);
  const fixedTitle = useRef<HTMLElement | null>(null);
  const [modalYTranslate, setModalYTranslate] = useState('-100vh');
  const modalOverlay = useRef<HTMLDivElement | null>(null);

  // useRenderingTrace({
  //   name: 'modal',
  //   props: {
  //     show,
  //     modalContent,
  //     loading,
  //     // children,
  //     beforeModalClose,
  //     modalStyle,
  //   },
  //   state: {
  //     modalHeight,
  //     modalOverflowHidden,
  //     firstEnter,
  //     exitClass,
  //     modalContentHistory,
  //     modalPropsHistory,
  //     modalYTranslate,
  //   },
  // });

  useEffect(() => {
    if (!show) {
      setModalOverflowHidden(true);
      setExitClass('');
      setTimeout(() => {
        if (modalOverlay.current && !show) {
          modalOverlay.current.classList.add('hide');
        }
      }, 400);
    } else if (modalOverlay.current) {
      modalOverlay.current.classList.remove('hide');
    }
  }, [show, setExitClass]);

  useEffect(() => {
    if (modalOverlay.current && modalContent.transparent) {
      modalOverlay.current.classList.add(classes.TransparentModal);
    } else if (modalOverlay.current) {
      modalOverlay.current.classList.remove(classes.TransparentModal);
    }
  }, [modalContent.transparent]);

  const observeHeight = (entry: ResizeObserverEntry) => {
    const { height } = entry.contentRect;
    if (show) setModalHeight(height ? height + 50 : height);
  };

  useEffect(() => {
    if (modalOuterWrapper.current) {
      modalOuterWrapper.current.style.height = `${modalHeight}px`;
    }
  }, [modalHeight]);

  useResizeObserver({
    callback: observeHeight,
    element: modalInner,
  });

  const onModalEnter = () => {
    if (modalInner.current) {
      setModalHeight(modalInner.current.offsetHeight);
    }
  };

  const closePopUp = () => {
    setModalOverflowHidden(true);
    setExitClass('');
  };
  const closePopUpOnOutClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'overlay-modal' || target.classList.contains('modal-overlay-inner')) {
      setModalOverflowHidden(true);
      setExitClass('');
    }
  };

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setFirstEnter(true);
      }, 500);
    }
  }, [show, modalHeight, setFirstEnter]);

  useEffect(() => {
    setModalYTranslate(`-${Math.min(modalHeight, vh(75)) / 2}px`);
  }, [firstEnter, modalHeight]);

  useEffect(() => {
    setTimeout(() => {
      if (modalInner.current && backBtn.current) {
        const fixedTitleElm = modalInner.current.querySelector('.modal-fixed-title');
        if (fixedTitleElm) {
          fixedTitleElm.classList.add(classes.LeftMarginTitle);
          fixedTitle.current = fixedTitleElm as HTMLElement;
        } else {
          modalInner.current.classList.add(classes.LeftMarginTitle);
        }
      }
    }, 500);
  }, [modalContent, children]); // children

  useEffect(() => {
    /**
   * Closes the modal and runs an aditional function if provided
   */
    if (!exitClass.current) {
      beforeModalClose();
      setFirstEnter(true);
      setModalHeight(0);
      closeModal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exitClass.current]);

  useEffect(() => {
    setModalOverflowHidden(true);
    if (modalContent.name !== null) {
      setTimeout(() => {
        setExitClass(`${classes.ExitActive} ${classes.Animate}`);
        setFirstEnter(false);
      }, 400);
      setTimeout(() => {
        setModalOverflowHidden(false);
      }, 800);
    }
    if (!modalContent.name) {
      setModalContentHistory([]);
      setModalPropsHistory([]);
    }
  }, [modalContent.name, setExitClass, setFirstEnter]);

  useEffect(() => {
    if (modalOuterWrapper.current) {
      if (modalContent.overflow) {
        modalOuterWrapper.current.style.overflow = modalContent.overflow;
      } else {
        modalOuterWrapper.current.style.removeProperty('overflow');
      }
    }
  }, [modalContent.overflow]);

  useEffect(() => {
    setModalContentHistory((history) => {
      if (modalContent.name) {
        return history.concat(modalContent.name).splice(-3);
      }
      return history;
    });
    setModalPropsHistory((history) => history.concat(modalContent.propsToChildren).splice(-3));
  }, [modalContent.name, modalContent.propsToChildren]);

  const returnToPreviousModal = () => {
    setModalContent({
      name: modalContentHistory[modalContentHistory.length - 2],
      propsToChildren: modalPropsHistory[modalPropsHistory.length - 2],
    });
  };

  return (
    <Portal id="overlay-modal">
      <>
        <Backdrop show onClick={closePopUp}/>
        <div
          ref={modalOverlay}
          role="button"
          className="modal-overlay-inner hide"
          tabIndex={-1}
          onKeyUp={modalContent.closeBtn ? closePopUpOnOutClick : undefined}
          onClick={modalContent.closeBtn ? closePopUpOnOutClick : undefined}
        >
          <div
            className={classes.ModalWrapper}
            id="modal-wrapper"
            style={{
              transform: `translate(calc(50vw - 50%), ${modalYTranslate})`,
              opacity: show ? '1' : '0',
              ...wrapperStyle,
            }}
          >
            {
            loading
              ? (
                <Backdrop show>
                  <LoadingSpinner width={150} divStyle={{ position: 'static' }} />
                </Backdrop>
              )
              : null
          }
            <div
            className={`${classes.Modal} ${modalOverflowHidden ? classes.ModalOverflowHidden : classes.ModalOverflow}`}
            ref={modalOuterWrapper}
            style={{
              ...modalOuterStyle,
            }}
          >
              {
              modalContent.canGoBack
                ? (
                  <Left
                    size={20}
                    ref={backBtn}
                    buttonClassName={classes.BackBtn}
                    button
                    onClick={returnToPreviousModal}
                  />
                )
                : null
            }
              {
              modalContent.closeBtn
                ? (
                  <CloseBtn
                    button
                    className={classes.Close}
                    onClick={closePopUp}
                    hoverColor={closeBtn?.hoverColor}
                    color={closeBtn?.color}
                  />
                )
                : null
            }
              <SwitchTransition mode="out-in">
                <CSSTransition
                in={show}
                key={modalContent.name as string}
                timeout={firstEnter.current ? 40 : 400}
                unmountOnExit
                classNames={{
                  enter: `${firstEnter.current ? '' : `${classes.Enter} ${classes.Animate}`}`,
                  enterActive: `${classes.EnterActive} ${classes.Animate}`,
                  exit: `${classes.Exit} ${classes.Animate}`,
                  exitActive: exitClass.current,
                }}
                onEnter={onModalEnter}
              >
                  <div id="modal-inner-wrapper" ref={modalInner} className={`${classes.ModalInnerWrapper} ${classes.NoTransparent}`} style={modalInnerStyle}>
                    { children ? React.cloneElement(children as React.ReactElement<any, string | React.JSXElementConstructor<any>>, { ...(modalContent.propsToChildren ?? {}) }) : null}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            </div>
          </div>
        </div>
      </>
    </Portal>
  );
};

export default Modal;
