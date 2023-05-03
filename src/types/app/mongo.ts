import type { ObjectId } from 'mongodb';

export const MongoCollections = {
  aerodrome: { name: 'aerodromes', alias: 'aerodromeDb' },
  rwy: { name: 'runways', alias: 'runwayDb' },
  coord: { name: 'aerodrome-coords', alias: 'aerodromeCoordsDb' },
} as const;

export type MongoDocumentMap<C extends typeof MongoCollections[keyof typeof MongoCollections]['alias']> =
C extends 'aerodromeDb'
? IAerodromeSchema
: C extends 'runwayDb'
? IRwySchema
: C extends 'aerodromeCoordsDb'
? IAerodromeCoordsSchema
: never;

export interface IAerodromeSchema {
  icao: string;
  type: string;
  name: string;
  city: string;
  uf: string;
  DAMDT: string;
  link: string;
  elev: number;
  fir: string;
  com: {
    name: string;
    freq?: string[];
  }[] | null;
  radioNav: string[] | null;
  met: {
    phone: null | string;
    type: string;
    met: {
      index: number;
      value: string;
    }[];
  }[] | null;
  ais: {
    ais: string;
    aisCivil?: string;
  } | null
  rmk: { [key: string]: string[] } | null;
  intl: boolean;
  airportUtil: string;
  time: string;
  operType: { [key: string]: boolean };
  lights: {
    light: string;
    meaning: string;
  }[];
  charts: {
    [key: string]: {
      link: string;
      name: string;
    }[]
  };
  CMB?: string[] | null;
  SER?: string[] | null;
  RFFS?: {
    maxWidth: number;
    cat: number;
  } | null;
  cityDistance?: string;
  rwys: ObjectId[];
  coords: ObjectId;
}

export interface IAerodromeCoordsSchema {
  aerodrome: ObjectId;
  deg: string,
  decim: [lon: number, lat: number]
}

export interface IRwySchema {
  aerodrome: ObjectId;
  rwy: string;
  length: number;
  width: number;
  surface: string;
  pcn: {
    maxWeight?: string;
    maxTirePressure?: string;
    PCN?: string;
    pavement?: string;
    subGrade?: string;
    tirePressure?: string;
    evalMethod?: string;
  } | null;
  lights: {
    light: string;
    meaning: string;
  }[];
  dims?: {
    RWY: string;
    'TORA(m)': string;
    'TODA(m)': string;
    'ASDA(m)': string;
    'LDA(m)': string;
    'ALT. GEOIDAL(m)': string;
    COORDENADAS: string;
  };
}
