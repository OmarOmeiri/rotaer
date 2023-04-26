

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
  };
  elev: number;
  rwys: {
    rwy?: string;
    length: number | null;
    width: number | null;
    surface: string | null;
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
    met: {
      index: number;
      value: string;
    }[];
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
  lights: {
    light: string;
    meaning: string;
  }[];
  charts: { [key: string]: {
    link: string;
    name: string;
  }[] };
  CMB?: string[] | null;
  SER?: string[] | null;
  RFFS?: {
    maxWidth: number;
    cat: number;
  } | null;
  cityDistance?: string;
}
