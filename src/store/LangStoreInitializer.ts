'use client';

import { useEffect, useRef } from 'react';
import langStore from './lang/langStore';
import Translator from '../utils/Translate/Translator';

type Props = {
  lang: Langs
}

/** */
function LangStoreInitializer({ lang }: Props) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      langStore.setState({ lang });
      Translator.setLang(lang);
      initialized.current = true;
    }
  }, [lang]);

  return null;
}

export default LangStoreInitializer;
