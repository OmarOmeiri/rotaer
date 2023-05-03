/* eslint-disable require-jsdoc */
/* eslint-disable import/no-mutable-exports */
import { MongoClient, Db, Collection } from 'mongodb';
import type { MongoCollections, MongoDocumentMap } from '../types/app/mongo';

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@rotaer.9yacaq5.mongodb.net/?retryWrites=true&w=majority`;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const options = {
  maxIdleTimeMS: 10000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 20000,
};

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGO_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGO_URI, options);
  clientPromise = client.connect();
}

export default async function getDb(collection?: undefined): Promise<Db>;
export default async function getDb<
C extends typeof MongoCollections[keyof typeof MongoCollections]
>(collection: C)
: Promise<Collection<MongoDocumentMap<C['alias']>>>;
export default async function getDb<
C extends typeof MongoCollections[keyof typeof MongoCollections]
>(collection: C[])
: Promise<{[K in C['alias']]: Collection<MongoDocumentMap<K>> }>;
export default async function getDb<
C extends typeof MongoCollections[keyof typeof MongoCollections]
>(collection?: C | C[])
: Promise<Db | Collection<MongoDocumentMap<C['alias']>> | {[K in C['alias']]: Collection<MongoDocumentMap<K>> }> {
  const db = (await clientPromise).db('test');
  if (collection) {
    if (Array.isArray(collection)) {
      return collection.reduce((cls, c) => {
        cls[c.alias as C['alias']] = db.collection(c.name);
        return cls;
      }, {} as {[K in C['alias']]: Collection<MongoDocumentMap<K>> });
    }
    return db.collection(collection.name);
  }
  return db;
}
