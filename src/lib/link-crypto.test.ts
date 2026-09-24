import { beforeAll, describe, expect, test } from "vitest";
import { decryptLinkToken, encryptLinkToken } from "./link-crypto";

const SECRET = "test-link-secret";

beforeAll(() => {
  process.env.LINK_SECRET = SECRET;
});

// Mints a token the way the code did before `format` existed: three
// \x1f-separated parts. Real tokens in this shape are sitting in sent email
// right now, so decryption has to keep accepting them.
async function mintLegacyToken(
  slug: string,
  source: string,
  campaign: string
) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(SECRET)
  );
  const key = await crypto.subtle.importKey("raw", digest, "AES-GCM", false, [
    "encrypt",
  ]);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode([slug, source, campaign].join("\x1f"))
  );

  return Buffer.concat([iv, new Uint8Array(ciphertext)]).toString("base64url");
}

describe("encryptLinkToken / decryptLinkToken", () => {
  test("round-trips a qr token with its format intact", async () => {
    const token = await encryptLinkToken({
      slug: "github",
      source: "resume",
      campaign: "acme-staff-eng",
      format: "qr",
    });

    expect(await decryptLinkToken(token)).toEqual({
      slug: "github",
      source: "resume",
      campaign: "acme-staff-eng",
      format: "qr",
    });
  });

  test("round-trips a link token with null attribution", async () => {
    const token = await encryptLinkToken({
      slug: "site",
      source: null,
      campaign: null,
      format: "link",
    });

    expect(await decryptLinkToken(token)).toEqual({
      slug: "site",
      source: null,
      campaign: null,
      format: "link",
    });
  });

  test("reads a token minted before format existed as a link", async () => {
    const token = await mintLegacyToken("linkedin", "email", "");

    expect(await decryptLinkToken(token)).toEqual({
      slug: "linkedin",
      source: "email",
      campaign: null,
      format: "link",
    });
  });

  test("rejects an unknown format rather than trusting it", async () => {
    const token = await encryptLinkToken({
      slug: "github",
      source: null,
      campaign: null,
      // A token minted under a future format this build doesn't know.
      format: "hologram" as "qr",
    });

    expect((await decryptLinkToken(token))?.format).toBe("link");
  });

  test("returns null for a tampered token", async () => {
    const token = await encryptLinkToken({
      slug: "github",
      source: null,
      campaign: null,
      format: "qr",
    });

    const bytes = Buffer.from(token, "base64url");
    bytes[bytes.length - 1] ^= 0xff;

    expect(await decryptLinkToken(bytes.toString("base64url"))).toBeNull();
  });

  test("returns null for garbage and truncated tokens", async () => {
    expect(await decryptLinkToken("")).toBeNull();
    expect(await decryptLinkToken("not-a-token")).toBeNull();
    expect(await decryptLinkToken("a".repeat(12))).toBeNull();
  });
});
