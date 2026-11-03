import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}
declare global {
  var mongooseCache: MongooseCache | undefined;
}
let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = {
    conn: null,
    promise: null,
  };
}
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define MONGODB_URI in your .env.local file'
    );
  }
  if (cached?.conn) {
    return cached.conn;
  }
  if (!cached?.promise) {
    cached!.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: 'booknook',
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => mongooseInstance);
  }
  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw error;
  }
  return cached!.conn!;
}
export default connectToDatabase;