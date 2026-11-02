import dns from "node:dns";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGODB_URI = process.env.MONGODB_URI;
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing");
}

if (!BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is missing");
}

if (!BETTER_AUTH_URL) {
  throw new Error("BETTER_AUTH_URL is missing");
}

if (!NEXT_PUBLIC_APP_URL) {
  throw new Error("NEXT_PUBLIC_APP_URL is missing");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ?? new MongoClient(MONGODB_URI);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db("booknook");

const trustedOrigins = [
  BETTER_AUTH_URL,
  NEXT_PUBLIC_APP_URL,
];

export const auth = betterAuth({
  database: mongodbAdapter(db),

  secret: BETTER_AUTH_SECRET,

  baseURL: BETTER_AUTH_URL,

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
  },

  socialProviders:
    GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
          },
        }
      : {},
});

export type Auth = typeof auth;