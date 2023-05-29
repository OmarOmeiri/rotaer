import { IModalProps } from '../../components/Modal/typings';
import { allModals } from '../../store/modal/typings';
import { colors } from './colors';

const modalBaseStyle = {
  modalInnerStyle: {
    minHeight: '320px',
    height: 'fit-content',
  },
  modalOuterStyle: {
    overflow: 'hidden',
    backgroundColor: colors.dark,
  },
  wrapperStyle: {
    width: '350px',
  },
  closeBtn: {
    hoverColor: colors.green,
    color: colors.lightGrey,
  },
};

const BaseModal = {
  ...modalBaseStyle,
  modalInnerStyle: {
    ...modalBaseStyle.modalInnerStyle,
    minHeight: '250px',
  },
};

export const modalStyles: {[K in allModals]: IModalProps['modalStyle']} = {
  logIn: {
    ...modalBaseStyle,
  },
  changePassword: BaseModal,
  forgotPassword: BaseModal,
  resetPassword: BaseModal,
  saveTableColumns: BaseModal,
  deleteTableColumns: BaseModal,
  deleteAcftModal: BaseModal,
  editAcftModal: BaseModal,
};
