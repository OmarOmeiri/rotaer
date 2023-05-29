import type { Collection } from 'mongodb';
import {
  IAerodromeCoordsSchema,
  IAerodromeSchema,
  IRwySchema,
} from './aerodrome';

export const MongoCollections = {
  aerodrome: { name: 'aerodromes', alias: 'aerodromeDb' },
  rwy: { name: 'runways', alias: 'runwayDb' },
  coord: { name: 'aerodrome-coords', alias: 'aerodromeCoordsDb' },
  acft: { name: 'aircrafts', alias: 'acftsDb' },
  userAcft: { name: 'user-aircrafts', alias: 'userAcftsDb' },
  user: { name: 'users', alias: 'userDb' },
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
: C extends 'userAcftsDb'
? IUserAcft
: C extends 'userDb'
? IUserSchema
: never;

type DbKeys = typeof MongoCollections[keyof typeof MongoCollections]['alias']
export type AllDbs = {
  [K in DbKeys]: Collection<MongoDocumentMap<K>>
}

export type WithStrId<T> = T & {_id: string}
