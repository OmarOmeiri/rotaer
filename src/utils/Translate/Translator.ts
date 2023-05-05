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
    this.lang = lang;
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
      const trl = this.translator?.[key]?.[lang || Translator.lang];
      if (!trl) return key;
      if (this.capt) return `${trl.charAt(0).toUpperCase()}${trl.slice(1, trl.length)}`;
      if (this.lower) return `${trl.charAt(0).toLowerCase()}${trl.slice(1, trl.length)}`;
      return trl;
    } catch (e) {
      console.log(e);
      console.log(key);
      console.log(Translator.lang);
      console.log(this.translator);
      throw e;
    } finally {
      this.capt = undefined;
      this.lower = undefined;
    }
  }
}

export default Translator;
