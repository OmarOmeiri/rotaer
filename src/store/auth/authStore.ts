import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { decrypt, encrypt } from 'lullo-utils/Encryption';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../../utils/LocalStorage/localStorage';
import { IUserModel } from '../../models/user/userModels';

export interface IAuthState {
  token: string | null,
  loading: boolean,
  isAuthenticated: boolean,
  reloading: boolean,
  user: Omit<IUserModel, 'password'> | null,
  expiresIn: null | number
}

interface IAuthStore extends IAuthState {
  logOut(): void;
  initToken(): void;
  setUser(user?: Omit<IUserModel, 'password'>): void;
  setAuthData(data: IAuthResponse): void;
  reloadUser(): void;
}

const initialState: IAuthState = {
  token: getLocalStorage('token'),
  isAuthenticated: false,
  loading: false,
  reloading: false,
  user: null,
  expiresIn: null,
};

const encryptToken = <T extends string | null>(token: T): T => (
  token
  // !token
  //   ? null as T
  //   : encrypt(
  //     token,
  //     process.env.AUTH_TOKEN_ENCRYPTION_KEY,
  //   ) as T
);

const decryptToken = <T extends string | null>(token: T): T => (
  token
  // !token
  //   ? null as T
  //   : decrypt(
  //     token,
  //     process.env.AUTH_TOKEN_ENCRYPTION_KEY,
  //   ) as T
);

const authLogOut = (set: ZuSet<IAuthStore>) => {
  removeLocalStorage('token');
  set({ ...initialState, token: null });
};

const authInitializeToken = (set: ZuSet<IAuthStore>) => {
  const token = getLocalStorage('token');
  set({ token });
};

const authSetUser = (set: ZuSet<IAuthStore>, user?: Omit<IUserModel, 'password'>) => {
  if (user) {
    set({
      loading: false,
      isAuthenticated: true,
      user,
      reloading: false,
    });
  } else {
    set(initialState);
  }
};

const authSetAuthData = (
  set: ZuSet<IAuthStore>,
  get: ZuGet<IAuthStore>,
  res: IAuthResponse,
) => {
  if (!res.token) {
    const { logOut } = get();
    logOut();
    return;
  }
  setLocalStorage(
    'token',
    encryptToken(res.token),
  );
  set(() => ({
    token: res.token || null,
    expiresIn: res.expiresIn || null,
    loading: true,
  }));
};

const authStore = create<IAuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      logOut: () => authLogOut(set),
      initToken: () => authInitializeToken(set),
      setUser: (user?: Omit<IUserModel, 'password'>) => authSetUser(set, user),
      setAuthData: (res: IAuthResponse) => authSetAuthData(set, get, res),
      reloadUser: () => {
        set({ reloading: true });
      },
    }),
    {
      name: 'auth',
      trace: process.env.NODE_ENV === 'development',
    },
  ),
);
export default authStore;
