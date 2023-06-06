import { parseStrToNumber } from 'lullo-utils/Number';
import cloudMap, { TMetarClouds } from './Clouds';
import rvrParser, { TMetarRVR } from './RVR';
import weatherMap, { TMetarRecentWeather, TMetarWeather } from './Weather';
import { SpeedConverter } from '../converters/speed';
import { relativeHumidity } from '../atmosphere/index';
import { removeNonNumericChars } from '../string/index';
import { PressureConverter } from '../converters/pressure';

const METAR_TYPES = [
  'METAR',
  'SPECI',
];

export type METARGroupNames =
| 'header'
| 'time'
| 'auto'
| 'wind'
| 'visibility'
| 'weather'
| 'recentWeather'
| 'clouds'
| 'atmosphere';

type Groups = [METARGroupNames, string[]][]

export type METARObject = ReturnType<METARParser['toObject']>

class METARParser {
  private metar: string;
  private fields: string[];
  private i = -1;
  private current: string | null = null;
  // private result: {[key: string]: any} = {};

  private type!: string;
  private correction!: boolean;
  private station: string | null = null;
  private time: Date | null = null;
  private auto = false;
  private wind: {
    speed: number,
    gust: number | null,
    direction: number | 'VRB',
    variation: {
      min: number,
      max: number,
    } | null
  } = {
      speed: 0,
      gust: null,
      direction: 0,
      variation: null,
    };
  private cavok = false;
  private visibility: number | null = null;
  private visibilityVariation: string | null = null;
  private visibilityVariationDirection: string | null = null;
  private rvr: TMetarRVR[] | null = null;
  private weather: TMetarWeather[] | null = null;
  private recentWeather: TMetarRecentWeather[] | null = null;
  private clouds: TMetarClouds[] | null = null;
  private temperature: number | null = null;
  private dewpoint: number | null = null;
  private relativeHumidity: number | null = null;
  private baroPressure: number | null = null;
  private groups: Groups = [];
  private status: 'IMC' | 'VMC' = 'VMC';

  constructor(metarString: string) {
    this.metar = metarString.replace(/=(\s)?$/, '').trim();
    this.fields = this.metar
      .split(' ')
      .map((f) => f.trim())
      .filter((f) => !!f);
  }

  private next() {
    this.i += 1;
    this.current = this.fields[this.i] || null;
    return this.current;
  }

  private peek(incr = 1) {
    return this.fields[this.i + incr] as string | undefined;
  }

  private addToGroup(key: METARGroupNames, value: TypeOrArrayOfType<string>) {
    const ix = this.groups.findIndex((g) => g[0] === key);
    const val = [value].flat();
    if (ix > -1) {
      this.groups[ix][1].push(...val);
    } else {
      this.groups.push([key, [...val]]);
    }
  }

  private parseType() {
    const token = this.peek();

    if (!token || METAR_TYPES.indexOf(token) === -1) {
      this.type = 'METAR';
    } else {
      this.next();
      this.type = this.current || 'METAR';
    }

    this.addToGroup('header', this.type);
  }

  private parseCorrection() {
    if (this.correction) {
      return;
    }
    const token = this.peek();
    this.correction = false;

    if (token === 'COR' || token === 'CCD') {
      this.correction = true;
      this.addToGroup('header', token);
    }
  }

  private parseStation() {
    this.next();
    if (!this.current) return;
    if (/^[A-Z]{4}$/.test(this.current)) {
      this.station = this.current;
      this.addToGroup('header', this.current);
    }
  }

  private parseDate() {
    this.next();
    if (!this.current) return;
    const d = new Date();
    d.setUTCDate(parseStrToNumber(this.current.slice(0, 2)));
    d.setUTCHours(parseStrToNumber(this.current.slice(2, 4)));
    d.setUTCMinutes(parseStrToNumber(this.current.slice(4, 6)));
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);
    this.time = d;
    this.addToGroup('time', this.current);
  }

  private parseAuto() {
    const auto = this.peek();
    if (!auto) return;
    this.auto = auto === 'AUTO';
    if (this.auto) {
      this.addToGroup('auto', auto);
      this.next();
    }
  }

  private parseWind() {
    if ((this.peek() || '').match(/^[0-9]{1,4}(SM?)/)) {
      return;
    }
    this.next();

    if (!this.current) return;
    const direction = this.current.slice(0, 3);
    if (direction === 'VRB') {
      this.wind.direction = 'VRB';
    } else {
      this.wind.direction = parseStrToNumber(direction);
    }

    const gust = this.current.slice(5, 8);
    if (gust[0] === 'G') {
      this.wind.gust = parseStrToNumber(gust.slice(1));
    }

    const speed = parseStrToNumber(this.current.slice(3, 5));

    const unitMatch = this.current.match(/KT|MPS|KPH|SM$/);
    const [unit] = (unitMatch || []);
    if (unit === 'KT') this.wind.speed = Math.round(speed);
    else if (unit === 'MPS') this.wind.speed = Math.round(SpeedConverter.ms(speed).toKt());
    else if (unit === 'KPH') this.wind.speed = Math.round(SpeedConverter.kmh(speed).toKt());
    else if (unit === 'SM') this.wind.speed = Math.round(SpeedConverter.mph(speed).toKt());

    this.addToGroup('wind', this.current);

    const varMatch = (this.peek() || '').match(/^([0-9]{3})V([0-9]{3})$/);
    if (varMatch) {
      this.next();
      this.wind.variation = {
        min: parseStrToNumber(varMatch[1]),
        max: parseStrToNumber(varMatch[2]),
      };
      if (this.current) this.addToGroup('wind', this.current);
    }
  }

  private parseCavok() {
    const nextValue = this.peek();
    if (!nextValue) return;
    this.cavok = nextValue === 'CAVOK';
    if (this.cavok) {
      this.addToGroup('weather', nextValue);
      this.next();
    }
  }

  private parseVisibility() {
    const re = /^([0-9]+)([A-Z]{1,2})/g;
    this.visibility = null;
    this.visibilityVariation = null;
    this.visibilityVariationDirection = null;
    if (this.cavok) return;

    this.next();
    if (!this.current || this.current === '////') return;
    const vis = this.current.slice(0, 4);
    this.visibility = parseStrToNumber(vis);
    this.addToGroup('visibility', vis);

    // Look for a directional variation report
    if ((this.peek() || '').match(/^[0-9]+[N|E|S|W|NW|NE|SW|SE]/)) {
      this.next();

      const matches = re.exec(this.current);
      if (matches) {
        const [variation, direction] = matches;
        this.visibilityVariation = variation;
        this.visibilityVariationDirection = direction;
        this.addToGroup('visibility', [variation, direction]);
      }
    }
  }

  private parseRunwayVisibility() {
    if (this.cavok) return;
    if (!(this.peek() || '').match(/^R[0-9]+/)) return;

    this.next();
    if (!this.current) return;
    const rvr = rvrParser.parse(this.current);
    if (rvr) {
      this.rvr = [
        ...(this.rvr || []),
        rvr,
      ];
      this.addToGroup('visibility', this.current);
    }
    this.parseRunwayVisibility();
  }

  private parseWeather() {
    if (this.cavok) return;

    const nextValue = this.peek() || '';
    if (weatherMap.isWeather(nextValue)) {
      if (!this.weather) this.weather = [];
      const value = weatherMap.parse(nextValue);
      this.weather = this.weather.concat(value);
      this.addToGroup('weather', nextValue);
      this.next();
      this.parseWeather();
    }
  }

  private parseClouds() {
    if (this.cavok) return;

    const nextValue = this.peek() || '';
    if (cloudMap.isCloud(nextValue)) {
      if (!this.clouds) this.clouds = [];
      const value = cloudMap.parse(nextValue);
      if (value) {
        this.clouds = this.clouds.concat(value);
        this.addToGroup('clouds', nextValue);
      }
      this.next();
      this.parseClouds();
    }
  }

  private parseTempDewpoint() {
    this.next();
    if (!this.current) return;
    const replaced = this.current.replace(/M/g, '-');
    const a = replaced.split('/');
    if (a.length !== 2) return; // expecting XX/XX
    const temp = parseStrToNumber(a[0]);
    const dewPoint = parseStrToNumber(a[1]);
    this.temperature = temp;
    this.dewpoint = dewPoint;
    this.relativeHumidity = Math.round(relativeHumidity({
      temp,
      dewPoint,
    }));
    this.addToGroup('atmosphere', this.current);
  }

  private parseAltimeter() {
    this.next();
    if (!this.current) return;

    const pressure = Number(removeNonNumericChars(this.current));
    if (this.current[0] === 'Q') {
      this.baroPressure = pressure;
      this.addToGroup('atmosphere', this.current);
    } else if (this.current[0] === 'A') {
      this.baroPressure = PressureConverter.inHg(pressure).tohPa();
      this.addToGroup('atmosphere', this.current);
    }
  }

  private parseRecentSignificantWeather() {
    const nextValue = this.peek();
    if (!nextValue) return;
    if (weatherMap.isRecentWeather(nextValue)) {
      if (!this.recentWeather) this.recentWeather = [];
      const value = weatherMap.parseRecentWeather(nextValue);
      if (value) {
        this.recentWeather = this.recentWeather.concat(value);
        this.addToGroup('recentWeather', nextValue);
      }
      this.next();
      this.parseRecentSignificantWeather();
    }
  }

  private parseStatus() {
    const ceiling = this.clouds
      ?.filter((c) => ['BKN', 'OVC'].includes(c.value))
      .reduce((ceil, c) => {
        if (!ceil) return c.base;
        if (c.base < ceil) return c.base;
        return ceil;
      }, null as number | null) || null;
    if ((
      this.visibility
        && this.visibility < 5000
    ) || (
      ceiling
        && ceiling < 1500
    )
    ) {
      this.status = 'IMC';
    }
  }

  parse() {
    this.parseType();
    this.parseCorrection();
    this.parseStation();
    this.parseDate();
    this.parseAuto();
    this.parseCorrection(); // Second possible position for the correction
    this.parseWind();
    this.parseCavok();
    this.parseVisibility();
    this.parseRunwayVisibility();
    this.parseWeather();
    this.parseClouds();
    this.parseTempDewpoint();
    this.parseAltimeter();
    this.parseRecentSignificantWeather();
    this.parseStatus();
    return this;
  }

  toObject() {
    return {
      metar: {
        type: this.type,
        correction: this.correction,
        station: this.station,
        time: this.time,
        auto: this.auto,
        wind: this.wind,
        cavok: this.cavok,
        visibility: this.visibility,
        visibilityVariation: this.visibilityVariation,
        visibilityVariationDirection: this.visibilityVariationDirection,
        rvr: this.rvr,
        weather: this.weather,
        recentWeather: this.recentWeather,
        clouds: this.clouds,
        temperature: this.temperature,
        dewpoint: this.dewpoint,
        relativeHumidity: this.relativeHumidity,
        baroPressure: this.baroPressure,
        status: this.status,
      },
      groups: this.groups,
    };
  }
}

export default METARParser;

// /* TESTAR
// * METAR SBSM 032300Z 12004KT 3000 -RA OVC004 17/17 Q1015
// * METAR SBSM 041100Z 09004KT 060V120 1500 R11/P2000 R29/P2000 -DZ BR OVC002 17/17 Q1016
// */

// const metar = new METARParser('METAR SBSM 041100Z 09004KT 060V120 1500 R11/P2000 R29/P2000 -DZ BR OVC002 17/17 Q1016').parse().toObject();
// console.log('metar: ', JSON.stringify(metar, null, 2));
