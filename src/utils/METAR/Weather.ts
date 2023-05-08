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
}

class Weather_ {
  private WEATHER = {
    qualifier: [
      '-',
      '',
      '+',
      'VC',
    ],
    descriptor: [
      'MI',
      'PR',
      'BC',
      'DR',
      'BL',
      'SH',
      'TS',
      'FZ',
    ],
    precipitation: [
      'RA',
      'DZ',
      'SN',
      'SG',
      'IC',
      'PL',
      'GR',
      'GS',
      'UP',
    ],
    obscuration: [
      'FG',
      'VA',
      'BR',
      'HZ',
      'DU',
      'FU',
      'SA',
      'PY',
    ],
    other: [
      'SQ',
      'PO',
      'DS',
      'SS',
      'FC',
    ],
  };
  private allKeys = Object.values(this.WEATHER).flatMap((o) => o);
  private startsWithQualifierRe = /^(\+|-|VC)/;

  private getQualifier(key: string) {
    if (key.startsWith('VC')) return 'VC';
    if (key.startsWith('+')) return '+';
    if (key.startsWith('-')) return '-';
    return '';
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
    const result: TMetarRecentWeather[] = [];
    const chunked = strToChunks(key, 2);
    chunked.shift();
    for (const chunk of chunked) {
      const found = Object.entries(this.WEATHER).find(([, vals]) => {
        if (vals.includes(chunk)) {
          return true;
        }
        return false;
      });
      if (found) {
        const [type, arr] = found;
        result.push({
          type,
          value: arr[arr.indexOf(chunk)],
        });
      }
    }
    return result.length ? result : null;
  }

  parse(k: string) {
    const key = k.trim();
    const qualifier = this.getQualifier(key);
    const result: TMetarWeather = {
      qualifier,
      values: [],
    };
    const chunks = strToChunks(key.replace(qualifier, ''), 2);
    for (const chunk of chunks) {
      const found = Object.entries(this.WEATHER).find(([, vals]) => {
        if (vals.includes(chunk)) {
          return true;
        }
        return false;
      });
      if (found) {
        const [type, arr] = found;
        result.values.push({
          type,
          value: arr[arr.indexOf(chunk)],
        });
      }
    }

    return result;
  }
}

const weatherMap = new Weather_();
export default weatherMap;
