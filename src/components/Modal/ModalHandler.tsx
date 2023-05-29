'use client';

import { shallow } from 'zustand/shallow';
import dynamic from 'next/dynamic';
import modalStore from '../../store/modal/modalStore';
import type { allModals, modalChildProps } from '../../store/modal/typings';
import TransitionsModal from './Modal';
import RotaerLoadingSpinner from '../Loading/RotaerLoadingSpinner';
import DeleteAcftModal from './ModalContents/acft/DeleteAcftModal';
import EditAcftModal from './ModalContents/acft/EditAcftModal';

const ModalLoading = () => (
  <div>
    <RotaerLoadingSpinner width={200} opacity={0.3}/>
  </div>
);

const AuthModal = dynamic(() => import('./ModalContents/auth/LogInModal'), {
  ssr: false,
  loading: ModalLoading,
});

const getModal = <T extends allModals>(name: T, propsToChildren: modalChildProps<T>) => {
  switch (name) {
    case 'logIn': {
      const p = propsToChildren as modalChildProps<'logIn'>;
      return <AuthModal { ...p ?? {} } />;
    }
    case 'deleteAcftModal': {
      const p = propsToChildren as modalChildProps<'deleteAcftModal'>;
      return <DeleteAcftModal { ...p ?? {} }/>;
    }
    case 'editAcftModal': {
      const p = propsToChildren as modalChildProps<'editAcftModal'>;
      return <EditAcftModal { ...p ?? {} }/>;
    }
    default:
      return null;
  }
};

/** */
function ModalHandler() {
  const { modalContent } = modalStore((state) => ({
    modalContent: state.modalContent,
    loading: state.modalLoading,
    show: state.showModal,
  }), shallow);
  const { name, propsToChildren } = modalContent;
  if (!name) return null;
  const ModalChildren = getModal(name, propsToChildren);
  if (!ModalChildren) return null;
  return (
    <TransitionsModal>
      {ModalChildren}
    </TransitionsModal>
  );
}

export default ModalHandler;
