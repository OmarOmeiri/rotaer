'use client';

import * as React from 'react';
import MUIModal from '@mui/material/Modal';
import { shallow } from 'zustand/shallow';
import Box from '@mui/material/Box';
import modalStore from '../../store/modal/modalStore';
import Config from '../../config';

const { colors } = Config.get('styles');

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: colors.darklight,
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Modal = ({ children }: {children: JSX.Element}) => {
  const {
    setShow,
    show,
  } = modalStore((state) => ({
    closeModal: state.closeModal,
    setModalContent: state.setModalContent,
    show: state.showModal,
    setShow: state.setShowModal,
  }), shallow);
  const handleClose = () => setShow(false);

  return (
    <div>
      <MUIModal
        open={show}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {children}
        </Box>
      </MUIModal>
    </div>
  );
};

export default Modal;
