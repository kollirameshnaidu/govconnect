export function optionalDemoAuthPassword() {
  const value = process.env.DEMO_AUTH_PASSWORD?.trim();
  if (value) return value;
  if (process.env.NODE_ENV === "production") return "";
  return "GovConnect@2026";
}

export function demoAuthPassword() {
  const value = optionalDemoAuthPassword();
  if (!value) throw new Error("DEMO_AUTH_PASSWORD is not configured.");
  return value;
}
