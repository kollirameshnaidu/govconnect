type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const parts = forwarded?.split(",") ?? [];
  const ip = parts[parts.length - 1]?.trim() || request.headers.get("x-real-ip") || "local";
  return ip;
}

export function enforceRateLimit(key: string, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (current.count >= limit) {
    throw new Error("Too many attempts. Try again in a few minutes.");
  }
  current.count += 1;
}
