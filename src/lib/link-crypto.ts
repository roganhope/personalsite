// Sneaky link tokens: the whole payload (destination slug, source, campaign)
// rides inside the URL as an AES-256-GCM blob, so no link store exists and a
// minted link keeps working across deploys. The token is
// base64url( IV[12] ‖ ciphertext ‖ GCM tag[16] ) over "slug␟source␟campaign"
// (U+001F separators, empty string for null).
//
// LINK_SECRET must outlive sessions — minted tokens sit in sent messages for
// months, and rotating it silently turns them all into untracked redirects.

export type LinkPayload = {
  slug: string;
  source: string | null;
  campaign: string | null;
};

const SEPARATOR = "\x1f";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

let cachedKey: Promise<CryptoKey> | null = null;

// SHA-256 of the passphrase rather than a raw base64 key, so any
// human-typeable env value works.
function linkKey() {
  cachedKey ??= (async () => {
    const secret = process.env.LINK_SECRET;
    if (!secret) throw new Error("LINK_SECRET is not set");

    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(secret)
    );

    return crypto.subtle.importKey("raw", digest, "AES-GCM", false, [
      "encrypt",
      "decrypt",
    ]);
  })();

  return cachedKey;
}

export async function encryptLinkToken(payload: LinkPayload) {
  const plaintext = [
    payload.slug,
    payload.source ?? "",
    payload.campaign ?? "",
  ].join(SEPARATOR);

  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await linkKey(),
    new TextEncoder().encode(plaintext)
  );

  return Buffer.concat([iv, new Uint8Array(ciphertext)]).toString("base64url");
}

// Returns null for anything that isn't a token we minted — truncated,
// tampered, or encrypted under a different secret. Never throws.
export async function decryptLinkToken(
  token: string
): Promise<LinkPayload | null> {
  try {
    const bytes = Buffer.from(token, "base64url");
    if (bytes.length < IV_LENGTH + TAG_LENGTH) return null;

    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: bytes.subarray(0, IV_LENGTH) },
      await linkKey(),
      bytes.subarray(IV_LENGTH)
    );

    const parts = new TextDecoder().decode(plaintext).split(SEPARATOR);
    if (parts.length !== 3 || !parts[0]) return null;

    return {
      slug: parts[0],
      source: parts[1] || null,
      campaign: parts[2] || null,
    };
  } catch {
    return null;
  }
}
