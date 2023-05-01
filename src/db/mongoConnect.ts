/* eslint-disable import/no-mutable-exports */
import { MongoClient, Db } from 'mongodb';

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@rotaer.9yacaq5.mongodb.net/?retryWrites=true&w=majority`;
// console.log('MONGO_URI: ', MONGO_URI);

// let cachedDb: Db | null = null;
// let client: MongoClient | null = null;

// export const withMongo = async (dbName = 'rotaer') => {
//   if (cachedDb) {
//     console.log('👌 Using existing connection');
//     return Promise.resolve(cachedDb);
//   }

//   if (client) {
//     const db = cachedDb || client.db(dbName);
//     cachedDb = db;
//     return cachedDb;
//   }

//   console.log('🔥 New DB Connection');
//   client = await MongoClient.connect(MONGO_URI, {
//     maxIdleTimeMS: 10000,
//     serverSelectionTimeoutMS: 10000,
//     socketTimeoutMS: 20000,
//   });
//   cachedDb = client.db(dbName);
//   return cachedDb;
// };

// export const withMongo = async (dbName = 'rotaer') => {
//   if (cachedDb) {
//     console.log('👌 Using existing connection');
//     return Promise.resolve(cachedDb);
//   }

//   if (client) {
//     const db = cachedDb || client.db(dbName);
//     cachedDb = db;
//     return cachedDb;
//   }

//   console.log('🔥 New DB Connection');
//   client = await MongoClient.connect(MONGO_URI, {
//     maxIdleTimeMS: 10000,
//     serverSelectionTimeoutMS: 10000,
//     socketTimeoutMS: 20000,
//   });
//   cachedDb = client.db(dbName);
//   return cachedDb;
// };

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

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
