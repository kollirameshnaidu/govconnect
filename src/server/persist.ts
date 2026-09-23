import type { AnyBulkWriteOperation, Document } from "mongodb";
import { TRACKED_APPOINTMENTS } from "@/mock/homepage";
import { normalizeAdminConfig, type AdminConfig } from "@/lib/admin-config";
import { getRuntimeStore, replaceRuntimeStore } from "@/lib/runtime-store";
import { accountFromLegacy, seedAuthAccounts } from "@/server/accounts";
import { ensureMongoIndexes, getMongoDb } from "@/server/mongo";
import type { AuthAccount, Grievance, TrackedAppointment } from "@/types";

const ADMIN_CONFIG_ID = "config";

type StoreOptions = {
  write?: boolean;
};

type StringIdDoc = Document & { _id: string };

let queue: Promise<unknown> = Promise.resolve();

function withoutMongoId<T>(document: Document): T {
  const copy = { ...document };
  delete copy._id;
  return copy as T;
}

function appointmentDoc(item: TrackedAppointment): StringIdDoc {
  return { ...item, _id: item.id };
}

function accountDoc(item: AuthAccount): StringIdDoc {
  const doc: StringIdDoc = { ...item, _id: item.id };
  if (!doc.mobile) delete doc.mobile;
  return doc;
}

function grievanceDoc(item: Grievance): StringIdDoc {
  return { ...item, _id: item.id };
}

function adminDoc(config: AdminConfig): StringIdDoc {
  return { ...config, _id: ADMIN_CONFIG_ID };
}

async function loadStore() {
  const db = await getMongoDb();
  await ensureMongoIndexes();
  const appointments = db.collection<StringIdDoc>("appointments");
  const accounts = db.collection<StringIdDoc>("accounts");
  const legacyCitizens = db.collection<StringIdDoc>("citizens");
  const grievances = db.collection<StringIdDoc>("grievances");
  const admin = db.collection<StringIdDoc>("admin");

  let appointmentItems = (await appointments.find().toArray()).map((item) =>
    withoutMongoId<TrackedAppointment>(item),
  );
  if (!appointmentItems.length) {
    const seed = TRACKED_APPOINTMENTS.map((item) => ({ ...item }));
    if (seed.length) {
      await appointments.insertMany(seed.map(appointmentDoc));
    }
    appointmentItems = seed;
  }

  const savedAccounts = (await accounts.find().toArray())
    .map((item) => accountFromLegacy(withoutMongoId(item)))
    .filter((item): item is AuthAccount => Boolean(item))
    .map((item) => {
      if (!item.mobile) delete item.mobile;
      return item;
    });
  const migratedCitizens = (await legacyCitizens.find().toArray())
    .map((item) => accountFromLegacy(withoutMongoId(item), "citizen"))
    .filter((item): item is AuthAccount => Boolean(item));
  const merged = [...savedAccounts];
  for (const citizen of migratedCitizens) {
    if (!merged.some((item) => item.id === citizen.id)) merged.push(citizen);
  }
  const accountItems = await seedAuthAccounts(merged);
  const needsAccountSave = accountItems.some((item) => {
    const saved = savedAccounts.find((entry) => entry.id === item.id);
    return (
      !saved?.passwordHash ||
      Boolean(saved.emailVerified) !== Boolean(item.emailVerified) ||
      Object.prototype.hasOwnProperty.call(saved, "mobile") !== Boolean(item.mobile)
    );
  });
  if (needsAccountSave) {
    await upsertDocs("accounts", accountItems.map(accountDoc));
  }

  const adminRecord = await admin.findOne({ _id: ADMIN_CONFIG_ID });
  const adminConfig = normalizeAdminConfig(adminRecord ? withoutMongoId(adminRecord) : {});
  if (!adminRecord) {
    await admin.replaceOne({ _id: ADMIN_CONFIG_ID }, adminDoc(adminConfig), { upsert: true });
  }

  replaceRuntimeStore({
    appointments: appointmentItems,
    admin: adminConfig,
    accounts: accountItems,
    grievances: (await grievances.find().toArray()).map((item) => withoutMongoId<Grievance>(item)),
  });
}

async function upsertDocs(name: "appointments" | "accounts" | "grievances", docs: StringIdDoc[]) {
  if (!docs.length) return;
  const db = await getMongoDb();
  const operations: AnyBulkWriteOperation<StringIdDoc>[] = docs.map((item) => ({
    replaceOne: {
      filter: { _id: item._id },
      replacement: item,
      upsert: true,
    },
  }));
  await db.collection<StringIdDoc>(name).bulkWrite(operations);
}

async function saveStore(before: {
  appointments: Map<string, TrackedAppointment>;
  accounts: Map<string, AuthAccount>;
  grievances: Map<string, Grievance>;
  admin: AdminConfig;
}) {
  const store = getRuntimeStore();
  const db = await getMongoDb();
  await upsertDocs(
    "appointments",
    store.appointments.filter((item) => before.appointments.get(item.id) !== item).map(appointmentDoc),
  );
  await upsertDocs(
    "accounts",
    store.accounts.filter((item) => before.accounts.get(item.id) !== item).map(accountDoc),
  );
  await upsertDocs(
    "grievances",
    store.grievances.filter((item) => before.grievances.get(item.id) !== item).map(grievanceDoc),
  );
  if (store.admin !== before.admin) {
    await db
      .collection<StringIdDoc>("admin")
      .replaceOne({ _id: ADMIN_CONFIG_ID }, adminDoc(store.admin), { upsert: true });
  }
}

export function withStore<T>(fn: () => T | Promise<T>, options: StoreOptions = {}): Promise<T> {
  const write = options.write !== false;
  const run = queue.then(async () => {
    await loadStore();
    const store = getRuntimeStore();
    const before = {
      appointments: new Map(store.appointments.map((item) => [item.id, item])),
      accounts: new Map(store.accounts.map((item) => [item.id, item])),
      grievances: new Map(store.grievances.map((item) => [item.id, item])),
      admin: store.admin,
    };
    const result = await fn();
    if (write) await saveStore(before);
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
