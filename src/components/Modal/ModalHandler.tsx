import { CSSTransition } from 'react-transition-group';
import { shallow } from 'zustand/shallow';
import modalStore from '../../store/modal/modalStore';
import Modal from './Modal';

import type { allModals, modalChildProps } from '../../store/modal/typings';
import type { IModalProps } from './typings';

export interface IModalHandler {
  beforeModalClose?: () => void,
  modalStyle?: IModalProps['modalStyle']
}

const getModal = <T extends allModals>(name: T, propsToChildren: modalChildProps<T>) => {
  switch (name) {
    default:
      return null;
  }
};

/** */
function ModalHandler({ beforeModalClose, modalStyle }: IModalHandler) {
  const { modalContent, loading, show } = modalStore((state) => ({
    modalContent: state.modalContent,
    loading: state.modalLoading,
    show: state.showModal,
  }), shallow);
  const { name, propsToChildren } = modalContent;
  if (!name) return null;
  const ModalChildren = getModal(name, propsToChildren);
  if (!ModalChildren) return null;
  return (
    <CSSTransition
      in={show}
      timeout={show ? 0 : 500}
      unmountOnExit
    >
      <Modal beforeModalClose={beforeModalClose} modalStyle={modalStyle} show={show} modalContent={modalContent} loading={loading}>
        {ModalChildren}
      </Modal>
    </CSSTransition>
  );
}

export default ModalHandler;
