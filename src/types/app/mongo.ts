import type { ObjectId } from 'mongodb';
import { TAerodromeData } from './aerodrome';

export const MongoCollections = {
  aerodrome: { name: 'aerodromes', alias: 'aerodromeDb' },
  rwy: { name: 'runways', alias: 'runwayDb' },
  coord: { name: 'aerodrome-coords', alias: 'aerodromeCoordsDb' },
  acft: { name: 'aircrafts', alias: 'acftsDb' },
} as const;

export type MongoDocumentMap<C extends typeof MongoCollections[keyof typeof MongoCollections]['alias']> =
C extends 'aerodromeDb'
? IAerodromeSchema
: C extends 'runwayDb'
? IRwySchema
: C extends 'aerodromeCoordsDb'
? IAerodromeCoordsSchema
: C extends 'acftsDb'
? IAcft
: never;

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
