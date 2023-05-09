'use client';

import { useCallback, useRef, useState } from 'react';
import langStore from '../../../store/lang/langStore';
import Translator from '../../../utils/Translate/Translator';
import { findAircraft } from '../../../Http/requests/acft';

const translator = new Translator({
  regNo: { 'pt-BR': 'Matrícula', 'en-US': 'Reg. Nº.' },
  search: { 'pt-BR': 'Buscar', 'en-US': 'Search' },
});

export const AircraftSearch = () => {
  const lang = langStore((state) => state.lang);
  const regNoInput = useRef<HTMLInputElement | null>(null);
  const [acft, setAcft] = useState<any>({});
  const onSearchClick = useCallback(async () => {
    if (!regNoInput.current) return;
    const { value } = regNoInput.current;
    const acft = await findAircraft({ id: value });
    setAcft(acft);
  }, []);

  return (
    <div>
      <label>
        {translator.translate('regNo')}
        <input ref={regNoInput}/>
      </label>
      <button onClick={onSearchClick}>{translator.translate('search')}</button>
      <code>
        <pre>
          {JSON.stringify(acft, null, 2)}
        </pre>
      </code>
    </div>
  );
};
