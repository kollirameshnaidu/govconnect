export function appBaseUrl() {
  const explicit = (process.env.APP_URL ?? "").replace(/\/$/, "");
  if (explicit) return explicit;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production.replace(/\/$/, "")}`;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
