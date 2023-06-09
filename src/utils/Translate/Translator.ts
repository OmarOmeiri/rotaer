import { locales } from '../Locale/locale';
import { isClientSide } from '../Window/windowFuncs';

const getCurrentURL = () => {
  if (isClientSide()) return window.location.href;
  return null;
};

class Translator <const T extends Record<string, Record<Langs, string>>, S extends boolean = true> {
  private translator: T;
  private static lang: Langs = 'pt-BR';
  private capt: true | undefined;
  private lower: true | undefined;
  private strict: boolean;

  constructor(translator: T, strict?: S) {
    this.translator = translator;
    this.strict = strict || true;
  }

  static setLang(lang: Langs) {
    if (locales.includes(lang)) this.lang = lang;
  }

  private getLangFromUrl() {
    const url = getCurrentURL();
    if (!url) return Translator.lang;
    return locales.find((l) => url?.includes(l)) || Translator.lang;
  }

  capitalize() {
    this.capt = true;
    this.lower = undefined;
    return this;
  }

  toLower() {
    this.lower = true;
    this.capt = undefined;
    return this;
  }

  translate(
    key: S extends true ? keyof T : string,
    lang?: Langs,
  ) {
    try {
      const trl = this.translator?.[key]?.[lang || this.getLangFromUrl()];
      if (!trl) return key;
      if (this.capt) return `${trl.charAt(0).toUpperCase()}${trl.slice(1, trl.length)}`;
      if (this.lower) return `${trl.charAt(0).toLowerCase()}${trl.slice(1, trl.length)}`;
      return trl;
    } catch (e) {
      console.info(e);
      console.info(key);
      console.info(Translator.lang);
      console.info(this.translator);
      throw e;
    } finally {
      this.capt = undefined;
      this.lower = undefined;
    }
  }
}

export default Translator;
