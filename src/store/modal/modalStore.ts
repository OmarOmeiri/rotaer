import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { allModals, modalChildProps } from './typings';

export interface IModalState<T extends allModals> {
  showModal: boolean,
  modalContent: {
    name: T | null,
    closeBtn?: boolean,
    canGoBack?: boolean,
    propsToChildren: modalChildProps<T>
    transparent?: boolean,
    overflow?: '' | 'visible' | 'scroll' | 'hidden'
  },
  modalLoading: boolean,
}

const initialState: IModalState<allModals> = {
  showModal: false,
  modalLoading: false,
  modalContent: {
    name: null,
    closeBtn: true,
    canGoBack: false,
    propsToChildren: {} as any,
    transparent: false,
    overflow: '',
  },
};

type SetModalContent<T extends allModals> = {
  name: T,
  closeBtn?: IModalState<T>['modalContent']['closeBtn'],
  canGoBack?: IModalState<T>['modalContent']['canGoBack'],
  propsToChildren: modalChildProps<T>,
  transparent?: IModalState<T>['modalContent']['transparent'],
  overflow?: IModalState<any>['modalContent']['overflow'],
}

/**
 *
 * @param name modal Content name. See {@link ModalReduxTyping.AllModals}
 * @param closeBtn has a close button
 * @param canGoBack can go back to previous modal
 * @returns
 */
const setModalContent = <T extends allModals>({
  name,
  closeBtn = true,
  canGoBack = false,
  propsToChildren = {} as any,
  transparent,
  overflow = '',
  set,
}: SetModalContent<T> & {set: ZuSet<IModalStore>}) => {
  set({
    modalContent: {
      name,
      closeBtn,
      canGoBack,
      propsToChildren,
      transparent,
      overflow,
    },
  });
};

export interface IModalStore extends IModalState<allModals> {
  setModalContent: <T extends allModals>(params: SetModalContent<T>) => void
  setModalLoading: (loading: boolean) => void
  setShowModal: (show: boolean) => void
  closeModal: () => void
}

const modalStore = create<IModalStore>()(
  devtools(
    (set) => ({
      ...initialState,
      setModalContent: <T extends allModals>(params: SetModalContent<T>) => { setModalContent({ ...params, set }); },
      setModalLoading: (loading: boolean) => set({ modalLoading: loading }),
      setShowModal: (show: boolean) => set({ showModal: show }),
      closeModal: () => set({ showModal: false }),
    }),
    {
      name: 'modal',
      trace: process.env.NODE_ENV === 'development',
    },
  ),
);
export default modalStore;
