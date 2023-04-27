import { strToChunks } from '../string';

export type TMetarWeather = {
  qualifier: string,
  values: {
    type: string,
    value: string,
  }[],
}

export type TMetarRecentWeather = {
  type: string,
  value: string,
}[]

class Weather_ {
  private WEATHER = {
    qualifier: {
      '-': 'light',
      '': 'moderate',
      '+': 'heavy',
      VC: 'in the vicinity',
    },
    descriptor: {
      MI: 'shallow',
      PR: 'partial',
      BC: 'patches',
      DR: 'low drifting',
      BL: 'blowing',
      SH: 'showers',
      TS: 'thunderstorm',
      FZ: 'freezing',
    },
    precipitation: {
      RA: 'rain',
      DZ: 'drizzle',
      SN: 'snow',
      SG: 'snow grains',
      IC: 'ice crystals',
      PL: 'ice pellets',
      GR: 'hail',
      GS: 'small hail',
      UP: 'unknown precipitation',
    },
    obscuration: {
      FG: 'fog',
      VA: 'volcanic ash',
      BR: 'mist',
      HZ: 'haze',
      DU: 'widespread dust',
      FU: 'smoke',
      SA: 'sand',
      PY: 'spray',
    },
    other: {
      SQ: 'squall',
      PO: 'dust or sand whirls',
      DS: 'duststorm',
      SS: 'sandstorm',
      FC: 'funnel cloud',
    },
  };
  private allKeys = Object.values(this.WEATHER).flatMap((o) => Object.keys(o));
  private startsWithQualifierRe = /^(\+|-|VC)/;

  private getQualifier(key: string) {
    if (key.startsWith('VC')) return { meaning: this.WEATHER.qualifier.VC, value: 'VC' };
    if (key.startsWith('+')) return { meaning: this.WEATHER.qualifier['+'], value: '+' };
    if (key.startsWith('-')) return { meaning: this.WEATHER.qualifier['-'], value: '-' };
    return { meaning: this.WEATHER.qualifier[''], value: '' };
  }

  isWeather(key: string) {
    const strNoQualifier = key.replace(this.startsWithQualifierRe, '');
    if (strNoQualifier.length % 2 !== 0) return false;
    const chunked = strToChunks(strNoQualifier, 2);
    return chunked.every((s) => this.allKeys.includes(s));
  }

  isRecentWeather(key: string) {
    if (this.startsWithQualifierRe.test(key)) return false;
    if (!key.startsWith('RE')) return false;
    if (key.length % 2 !== 0) return false;
    const chunked = strToChunks(key, 2);
    chunked.shift();
    return chunked.every((s) => this.allKeys.includes(s));
  }

  parseRecentWeather(key: string) {
    const result: TMetarRecentWeather = [];
    const chunked = strToChunks(key, 2);
    chunked.shift();
    for (const chunk of chunked) {
      const found = Object.entries(this.WEATHER).find(([, val]) => {
        if (Object.keys(val).includes(chunk)) {
          return true;
        }
        return false;
      });
      if (found) {
        const [type, obj] = found;
        result.push({
          type,
          value: obj[chunk as keyof typeof obj],
        });
      }
    }
    return result.length ? result : null;
  }

  parse(key: string) {
    const { meaning, value } = this.getQualifier(key);
    const result: TMetarWeather = {
      qualifier: meaning,
      values: [],
    };
    const chunks = strToChunks(key.replace(value, ''), 2);
    for (const chunk of chunks) {
      const found = Object.entries(this.WEATHER).find(([, val]) => {
        if (Object.keys(val).includes(chunk)) {
          return true;
        }
        return false;
      });
      if (found) {
        const [type, obj] = found;
        result.values.push({
          type,
          value: obj[chunk as keyof typeof obj],
        });
      }
    }

    return result;
  }
}

const weatherMap = new Weather_();
export default weatherMap;
