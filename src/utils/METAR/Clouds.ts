export type TMetarClouds = {
  value: string,
  base: number,
  cb?: true,
  tcu?: true,
}

class Clouds_ {
  static cloudIndex = [
    'NCD',
    'SKC',
    'CLR',
    'NSC',
    'FEW',
    'SCT',
    'BKN',
    'OVC',
    'VV',
  ];
  private fullRe = new RegExp(`^(${Clouds_.cloudIndex.join('|')})(\\d{3})(CB|TCU)?`);

  isCloud(key: string) {
    return this.fullRe.test(key);
  }

  cloudIndex() {
    return Clouds_.cloudIndex;
  }

  parse(key: string) {
    const matches = key.match(this.fullRe);
    if (matches) {
      const [
        _,
        cloud,
        base,
        cbTcu,
      ] = matches;
      if (Clouds_.cloudIndex.includes(cloud)) {
        const result: TMetarClouds = {
          value: Clouds_.cloudIndex[Clouds_.cloudIndex.indexOf(cloud)],
          base: Number(base) * 100,
        };
        if (cbTcu === 'CB') result.cb = true;
        if (cbTcu === 'TCU') result.tcu = true;
        return result;
      }
    }
  }
}

const cloudMap = new Clouds_();
export default cloudMap;
