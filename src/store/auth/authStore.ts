import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { WithStrId } from '../../types/app/mongo';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookies/cookies';
import { setServerSideCookie } from '../../utils/cookies/serverCookies';

export interface IAuthState {
  token: string | null,
  loading: boolean,
  isAuthenticated: boolean,
  reloading: boolean,
  user: Omit<WithStrId<IUserSchema>, 'password'> | null,
}

interface IAuthStore extends IAuthState {
  logOut(): void;
  initToken(): void;
  setUser(user?: Omit<IUserSchema, 'password'>): void;
  setAuthData(data: IAuthResponse): void;
  resetAuthData(): void;
  reloadUser(): void;
}

const initialState: IAuthState = {
  token: getCookie('x-auth-token'),
  isAuthenticated: false,
  loading: false,
  reloading: false,
  user: null,
};

const authLogOut = (set: ZuSet<IAuthStore>) => {
  deleteCookie('x-auth-token');
  set({ ...initialState, token: null });
};

const authInitializeToken = (set: ZuSet<IAuthStore>) => {
  const token = getCookie('x-auth-token');
  set({ token });
};

const authSetUser = (set: ZuSet<IAuthStore>, user?: Omit<WithStrId<IUserSchema>, 'password'>) => {
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
  setCookie(
    'x-auth-token',
    res.token,
    { expAt: res.expiresAt },
  );
  set(() => ({
    token: res.token || null,
    loading: true,
  }));
};

const authStore = create<IAuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      logOut: () => authLogOut(set),
      initToken: () => authInitializeToken(set),
      setUser: (user?: Omit<WithStrId<IUserSchema>, 'password'>) => authSetUser(set, user),
      setAuthData: (res: IAuthResponse) => authSetAuthData(set, get, res),
      resetAuthData: () => set(initialState),
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
