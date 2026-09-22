import dns from "node:dns";
import { MongoClient, type Db } from "mongodb";

type GlobalMongo = typeof globalThis & {
  __gcMongoPromise?: Promise<MongoClient>;
  __gcMongoIndexes?: Promise<void>;
};

function mongodbUri() {
  return process.env.MONGODB_URI ?? "";
}

function mongodbDb() {
  return process.env.MONGODB_DB ?? "govconnect";
}

function patchWindowsDns() {
  try {
    dns.setDefaultResultOrder("ipv4first");
  } catch {
    // Older Node builds may not expose this helper.
  }
  if (process.platform !== "win32") return;
  const fallback = ["8.8.8.8", "1.1.1.1"];
  try {
    const current = dns.getServers();
    dns.setServers([...fallback, ...current.filter((server) => !fallback.includes(server))]);
  } catch {
    // Keep the process default resolvers if the OS rejects the override.
  }
}

function connectFailure(error: unknown) {
  const message = error instanceof Error ? error.message : "Could not connect to MongoDB.";
  return new Error(`MongoDB connection failed. ${message}`);
}

function connectClient(uri: string) {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 12000,
    connectTimeoutMS: 12000,
  });
  return client.connect();
}

async function connectedClient(uri: string): Promise<MongoClient> {
  const globalMongo = globalThis as GlobalMongo;
  if (!globalMongo.__gcMongoPromise) {
    globalMongo.__gcMongoPromise = connectClient(uri).catch((error: unknown) => {
      globalMongo.__gcMongoPromise = undefined;
      throw connectFailure(error);
    });
  }
  try {
    const connected = await globalMongo.__gcMongoPromise;
    await connected.db(mongodbDb()).command({ ping: 1 });
    return connected;
  } catch (error) {
    const stale = globalMongo.__gcMongoPromise;
    globalMongo.__gcMongoPromise = undefined;
    globalMongo.__gcMongoIndexes = undefined;
    if (stale) {
      try {
        const client = await stale.catch(() => null);
        await client?.close();
      } catch {
        // Replace the cached client even if close fails.
      }
    }
    globalMongo.__gcMongoPromise = connectClient(uri).catch((retryError: unknown) => {
      globalMongo.__gcMongoPromise = undefined;
      throw connectFailure(retryError);
    });
    const reconnected = await globalMongo.__gcMongoPromise;
    await reconnected.db(mongodbDb()).command({ ping: 1 }).catch((retryError: unknown) => {
      throw connectFailure(error instanceof Error ? error : retryError);
    });
    return reconnected;
  }
}

export async function getMongoDb(): Promise<Db> {
  const uri = mongodbUri();
  if (!uri) {
    throw new Error("MongoDB is not configured. Set MONGODB_URI in .env.local.");
  }
  patchWindowsDns();
  const connected = await connectedClient(uri);
  return connected.db(mongodbDb());
}

async function ensureUniqueMobileIndex(db: Db) {
  const accounts = db.collection("accounts");
  try {
    await accounts.dropIndex("mobile_1");
  } catch {
    // Index may not exist yet, or it may already use the partial filter below.
  }
  await accounts.createIndex(
    { mobile: 1 },
    {
      unique: true,
      name: "mobile_1",
      partialFilterExpression: { mobile: { $type: "string", $gt: "" } },
    },
  );
}

export async function ensureMongoIndexes() {
  const globalMongo = globalThis as GlobalMongo;
  if (!globalMongo.__gcMongoIndexes) {
    globalMongo.__gcMongoIndexes = (async () => {
      const db = await getMongoDb();
      await Promise.all([
        db.collection("appointments").createIndex({ citizenId: 1 }),
        db.collection("appointments").createIndex({ citizenMobile: 1 }),
        db.collection("accounts").createIndex(
          { email: 1 },
          { unique: true, partialFilterExpression: { email: { $gt: "" } } },
        ),
        ensureUniqueMobileIndex(db),
        db.collection("grievances").createIndex({ mobile: 1 }),
      ]);
    })().catch((error: unknown) => {
      globalMongo.__gcMongoIndexes = undefined;
      throw error;
    });
  }
  await globalMongo.__gcMongoIndexes;
}
