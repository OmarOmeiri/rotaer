'use client';

import USFlag from '@icons/us-flag.svg';
import BRFlag from '@icons/br-flag.svg';
import React, {
  Fragment,
  useCallback,
  useEffect,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import langStore from '../../store/lang/langStore';
import classes from './LanguageDropDown.module.css';
import TooltipClick from '../Tooltips/TooltipClick';
import { LANGS } from '../../types/app/langs';

const flags = {
  'en-US': { name: 'English', icon: <USFlag width="25"/> },
  'pt-BR': { name: 'Português', icon: <BRFlag width="25"/> },
};

const Tooltip = ({ lang, onLanguageChange }: {lang: Langs, onLanguageChange: React.MouseEventHandler}) => (
  <div className={classes.ButtonWrapper}>
    {
      Object.entries(flags)
        .map(([key, flag]) => (
          <Fragment key={key}>
            <button data-selected={key === lang} data-lang={key} className={classes.ButtonSelect} onClick={onLanguageChange}>
              <div>{flag.icon}</div>
              <div>{flag.name}</div>
            </button>
          </Fragment>
        ))
    }
  </div>
);

export const LanguageDropDown = () => {
  const router = useRouter();
  const pathName = usePathname() || '';
  const params = useSearchParams()?.toString() || '';
  const lang = langStore((state) => state.lang);

  const onLanguageChange = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    const lang = target.getAttribute('data-lang') as Langs;
    const searchParams = params;
    const newPath = pathName.replace(new RegExp(`(${LANGS.join('|')})`), lang);
    if (newPath === pathName) return;
    const newPathWithSearchParams = `${newPath}${searchParams ? `?${searchParams}` : ''}`;
    router.push(newPathWithSearchParams);
  }, [router, pathName, params]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  return (
    <TooltipClick
      tooltip={<Tooltip lang={lang} onLanguageChange={onLanguageChange}/>}
      placement='bottom'
      className={classes.TooltipContainer}
      close={false}
    >
      <button className={classes.ButtonMain}>
        {flags[lang].icon}
      </button>
    </TooltipClick>
  );
};
