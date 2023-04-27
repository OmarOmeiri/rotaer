export type TMetarClouds = {
  value: string,
  base: number,
  cb?: true,
  tcu?: true,
}

class Clouds_ {
  private CLOUDS = {
    NCD: 'no clouds',
    SKC: 'clear',
    CLR: 'no clouds under 12,000 ft',
    NSC: 'no significant clouds',
    FEW: 'few',
    SCT: 'scattered',
    BKN: 'broken',
    OVC: 'overcast',
    VV: 'vertical visibility',
  };
  private startingRe = new RegExp(`^(${Object.keys(this.CLOUDS).join('|')})`);
  private fullRe = new RegExp(`^(${Object.keys(this.CLOUDS).join('|')})(\\d{3})(CB|TCU)?`);

  isCloud(key: string) {
    return this.fullRe.test(key);
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
      if (Object.keys(this.CLOUDS).includes(cloud)) {
        const result: TMetarClouds = {
          value: this.CLOUDS[cloud as keyof typeof this.CLOUDS],
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
