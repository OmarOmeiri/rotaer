/* eslint-disable require-jsdoc */

import { useEffect, useRef } from 'react';
import Config from '../config';

const appId = Config.get('keys').oneSignalID;
export const usePushNotification = () => {
  const init = useRef(false);
  useEffect(() => {
    if (typeof window !== undefined && !init.current) {
      init.current = true;
      window.OneSignal = window.OneSignal || [];
      window.OneSignal.push(() => {
        window.OneSignal.init({
          appId,
          allowLocalhostAsSecureOrigin: true,
        });
      });
    }
    // return () => {
    //   window.OneSignal = undefined;
    // };
  }, []);
};
