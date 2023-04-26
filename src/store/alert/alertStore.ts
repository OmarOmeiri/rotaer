import uniqid from 'uniqid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type TAlertType =
| 'error'
| 'warning'
| 'info'
| 'success'

export interface IAlertState {
  msg: string,
  type: TAlertType | null,
  id: string,
  timeout?: number,
}

interface AlertStore extends IAlertState {
  setAlert: (payload: Expand<Omit<PartialRequired<IAlertState, 'type'>, 'id'>>) => void
  removeAlert: (id: string) => void
}

const initialState: IAlertState = {
  msg: '',
  type: null,
  id: '',
  timeout: 0,
};

const alertStore = create<AlertStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setAlert: (state) => {
        const id = uniqid();
        const timeout = state.timeout || 6000;
        set({ timeout, id, ...state });
        setTimeout(() => {
          get().removeAlert(id);
        }, timeout);
      },
      removeAlert: () => set(initialState),
    }),
    {
      name: 'alert',
      trace: process.env.NODE_ENV === 'development',
    },
  ),
);
export default alertStore;
