import bcrypt from "bcryptjs";

const ROUNDS = 10;
const DUMMY_HASH = bcrypt.hashSync("govconnect-timing-guard", ROUNDS);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, ROUNDS);
}

export async function verifyPassword(password: string, passwordHash?: string) {
  if (!passwordHash) {
    await bcrypt.compare(password, DUMMY_HASH);
    return false;
  }
  return bcrypt.compare(password, passwordHash);
}
