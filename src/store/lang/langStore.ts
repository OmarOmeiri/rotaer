import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LANGS } from '../../types/app/langs';
import Translator from '../../utils/Translate/Translator';

export interface ILangState {
  lang: Langs,
}

export interface ILangStore extends ILangState {
  setLang: (lang: Langs) => void
}

const initialState: ILangState = {
  lang: 'pt-BR',
};

const langStore = create<ILangStore>()(
  devtools(
    (set) => ({
      ...initialState,
      setLang: (lang) => {
        if (LANGS.includes(lang)) {
          set({ lang });
          Translator.setLang(lang);
        }
      },
    }),
    {
      name: 'lang',
      trace: process.env.NODE_ENV === 'development',
    },
  ),
);
export default langStore;
