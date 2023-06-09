

import type aerodromeList from '@/data/aerodrome_list.json'

export type TAerodrome = typeof aerodromeList[number];
export type TAerodromPrelimInfo =  {
  icao:   string;
  name:   string;
  coords: {
    degMinSec: string;
    decimal:   {
      lat: number;
      lon: number;
    };
  };
  type:   string;
  city:   string;
  uf:     string;
  elev:   number;
}

export type TAerodromeData = {
  icao: string;
  type: string;
  name: string;
  city: string;
  uf: string;
  DAMDT: string;
  link: string;
  coords: {
    degMinSec: string;
    decimal: {
      lat: number;
      lon: number;
    };
  } | null;
  elev: number;
  rwys: {
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
    lights: string[];
    dims?: {
      RWY:               string;
      "TORA(m)":         string;
      "TODA(m)":         string;
      "ASDA(m)":         string;
      "LDA(m)":          string;
      "ALT. GEOIDAL(m)": string;
      COORDENADAS:       string;
    };
  }[];
  fir: string;
  com: {
    name: string;
    freq?: string[];
  }[] | null;
  radioNav: string[] | null;
  met: {
    phone: null | string;
    type: string;
    met: number[];
  }[] | null;
  ais: {
    ais: string;
    aisCivil?: string;
  } | null;
  rmk: { [key: string]: string[] } | null;
  intl: boolean;
  airportUtil: string;
  time: string;
  operType: { [key: string]: boolean };
  lights: string[];
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
}


export type IAerodromeSchema =
TAerodromeData & {
  rwys: ObjectId[];
  coords: ObjectId;
}

export interface IAerodromeCoordsSchema {
  aerodrome: ObjectId;
  deg: string,
  decim: [lon: number, lat: number]
}

export type IRwySchema = {
  aerodrome: ObjectId;
} & TAerodromeData['rwys'][number]

