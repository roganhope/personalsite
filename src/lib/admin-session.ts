import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Stateless admin session: the cookie is `${expiry}.${hmac(expiry)}` signed
// with SESSION_SECRET, so there is nothing to store and rotating the secret
// logs every device out. SESSION_SECRET is deliberately separate from
// LINK_SECRET — sessions should be freely rotatable, minted links should not.

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function sign(value: string) {
  return createHmac("sha256", process.env.SESSION_SECRET!)
    .update(value)
    .digest("base64url");
}

export function createSessionValue() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE);
  return `${expires}.${sign(expires)}`;
}

// Absent, expired, or tampered all read as "not logged in"; never throws.
export function verifySessionValue(value: string | undefined) {
  if (!value || !process.env.SESSION_SECRET) return false;

  const [expires, signature] = value.split(".");
  if (!expires || !signature) return false;
  if (!/^\d+$/.test(expires)) return false;
  if (Number(expires) <= Math.floor(Date.now() / 1000)) return false;

  const expected = Buffer.from(sign(expires));
  const provided = Buffer.from(signature);
  return (
    expected.length === provided.length && timingSafeEqual(expected, provided)
  );
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  return verifySessionValue(cookieStore.get(SESSION_COOKIE)?.value);
}

// Hash both sides so comparison is constant-time regardless of input length.
export function checkPassword(input: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  return timingSafeEqual(
    createHash("sha256").update(input).digest(),
    createHash("sha256").update(password).digest()
  );
}
