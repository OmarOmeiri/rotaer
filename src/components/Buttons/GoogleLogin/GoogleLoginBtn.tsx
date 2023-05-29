'use client';

import React, { useEffect, useRef } from 'react';
import classes from './GoogleLoginBtn.module.css';

const GoogleLoginBtnMemo = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && window?.google?.accounts) {
      window.google.accounts.id.renderButton(ref.current, {
        type: 'standard',
        theme: 'filled_black',
      });

      setTimeout(() => {
        if (ref.current) {
          ref.current.style.opacity = '1';
        }
      }, 500);
    }
  }, []);

  return (
    <div id="googl-btn" ref={ref} className={classes.Wrapper} />
  );
};

export const GoogleLoginBtn = React.memo(GoogleLoginBtnMemo);
