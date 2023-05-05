'use client';

import { useRef } from 'react';
import langStore from './lang/langStore';

type Props = {
  lang: Langs
}

/** */
function LangStoreInitializer({ lang }: Props) {
  const initialized = useRef(false);
  if (!initialized.current) {
    langStore().setLang(lang);
    initialized.current = true;
  }
  return null;
}

export default LangStoreInitializer;
