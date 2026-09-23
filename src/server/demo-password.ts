export function demoAuthPassword() {
  const value = process.env.DEMO_AUTH_PASSWORD?.trim();
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("DEMO_AUTH_PASSWORD is not configured.");
  }
  return "GovConnect@2026";
}
