import type { MongoClient } from 'mongodb';  
declare global {  
  declare var _mongoClientPromise: Promise<MongoClient> | undefined;
}
declare var _mongoClientPromise: Promise<MongoClient> | undefined;
