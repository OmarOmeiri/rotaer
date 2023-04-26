/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import Router, {
  NextRouter,
  useRouter,
} from 'next/router';
/* eslint-disable no-param-reassign */
import { useEffect } from 'react';
import { isClientSide } from '@/utils/Window/windowFuncs';

export type TypedRouter = {
  push: (route: string, cb?: () => void) => void;
  replace: (route: string, cb?: () => void) => void;
  blocked: boolean;
  history: NextRouter;
}

export const useTypedRouter = (
  blockHistory?: boolean,
  blockHistoryMsg?: 'Dados não salvos serão perdidos. Tem certeza que deseja sair?',
): TypedRouter => {
  const history = useRouter();
  const blocked = false;
  // TODO check why custom blockHistoryMsg not showing

  useEffect(() => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      (e || window.event).returnValue = blockHistoryMsg;
      return blockHistoryMsg; // Gecko + Webkit, Safari, Chrome etc.
    };

    const beforeRouteHandler = (url: string) => {
      if (Router.pathname !== url && !confirm(blockHistoryMsg)) {
        // to inform NProgress or something ...
        Router.events.emit('routeChangeError');
        // eslint-disable-next-line no-throw-literal
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
      }
    };

    if (blockHistory) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
      Router.events.on('routeChangeStart', beforeRouteHandler);
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      Router.events.off('routeChangeStart', beforeRouteHandler);
    }

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      Router.events.off('routeChangeStart', beforeRouteHandler);
    };
  }, [blockHistoryMsg, blockHistory]);

  const push = (
    route: string,
    cb?: () => void,
  ) => {
    if (isClientSide()) {
      history.push(route);
    }
    if (!blocked && cb) cb();
  };

  const replace = (
    route: string,
    cb?: () => void,
  ) => {
    if (isClientSide()) {
      history.replace(route);
    }
    if (!blocked && cb) cb();
  };

  return {
    push,
    replace,
    blocked,
    history,
  };
};
