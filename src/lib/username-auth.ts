// Username-only auth: usernames are mapped to a deterministic internal
// address so Supabase Auth (which requires an email) can be used.
export const USERNAME_DOMAIN = "onewebs.local";

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

export function isEmail(value: string): boolean {
  return value.includes("@");
}

/** Turns a username (or a real email) into the address used for auth calls. */
export function toAuthEmail(identifier: string): string {
  const v = identifier.trim();
  if (isEmail(v)) return v.toLowerCase();
  return `${normalizeUsername(v)}@${USERNAME_DOMAIN}`;
}

/** What we show back to the user: username for internal addresses, email otherwise. */
export function displayIdentity(email: string | null | undefined): string {
  if (!email) return "";
  return email.toLowerCase().endsWith(`@${USERNAME_DOMAIN}`)
    ? email.slice(0, email.lastIndexOf("@"))
    : email;
}
