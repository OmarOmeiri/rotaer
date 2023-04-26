import { IModalState } from '../../store/modal/modalStore';
import { allModals } from '../../store/modal/typings';

export interface IModalProps {
  beforeModalClose?: () => void,
  show: IModalState<allModals>['showModal'],
  modalContent: IModalState<allModals>['modalContent'],
  loading: IModalState<allModals>['modalLoading'],
  children: JSX.Element,
  modalStyle?: {
    wrapperStyle?: React.CSSProperties,
    modalOuterStyle?: React.CSSProperties
    modalInnerStyle?: React.CSSProperties,
    closeBtn?: {
      hoverColor?: string
      color?: string,
    }
  }
}

