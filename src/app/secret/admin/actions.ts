"use server";

import { cookies } from "next/headers";
import QRCode from "qrcode";
import { destinations } from "@/lib/go-links";
import { encryptLinkToken } from "@/lib/link-crypto";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  createSessionValue,
  requireAdmin,
} from "@/lib/admin-session";

const SITE_ORIGIN = "https://hoperogan.com";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || !checkPassword(password)) {
    return { error: "Wrong password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // Setting the cookie re-renders the page, which swaps in the generator.
  return {};
}

export type GenerateState = {
  error?: string;
  slug?: string;
  source?: string | null;
  campaign?: string | null;
  readable?: string;
  sneaky?: string;
  // The QR encodes its own token, minted with format: "qr", so a scan and a
  // click on the same destination stay separable in PostHog.
  qrLink?: string;
  qrSvg?: string;
  qrPng?: string;
};

// Same character policy as the redirect route's attribution() parser, so what
// gets minted here is exactly what the click will record.
function sanitize(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  return value.replace(/[`\s]/g, "").slice(0, 100) || null;
}

export async function generateLinks(
  _prev: GenerateState,
  formData: FormData
): Promise<GenerateState> {
  // Auth is enforced here, not just in the proxy — server actions are plain
  // POSTs that a matcher change could silently uncover.
  if (!(await requireAdmin())) {
    return { error: "Session expired — log in again." };
  }

  const slug = formData.get("destination");
  if (typeof slug !== "string" || !(slug in destinations)) {
    return { error: "Pick a destination." };
  }

  const sourceChoice = formData.get("source");
  const source =
    sourceChoice === "custom"
      ? sanitize(formData.get("sourceCustom"))
      : sanitize(sourceChoice);
  const campaign = sanitize(formData.get("campaign"));

  const readable = new URL(`/go/${slug}`, SITE_ORIGIN);
  if (source) readable.searchParams.set("s", source);
  if (campaign) readable.searchParams.set("c", campaign);

  const [linkToken, qrToken] = await Promise.all([
    encryptLinkToken({ slug, source, campaign, format: "link" }),
    encryptLinkToken({ slug, source, campaign, format: "qr" }),
  ]);

  const qrLink = `${SITE_ORIGIN}/go/p/${qrToken}`;

  // Rendered here rather than in the browser so the token never reaches a
  // third-party image service. Plain black on white: a logo in the middle
  // spends error correction on decoration. "M" tolerates ~15% damage, which
  // covers the scuffing a printed card picks up.
  const [qrSvg, qrPng] = await Promise.all([
    QRCode.toString(qrLink, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
    }),
    QRCode.toDataURL(qrLink, {
      type: "image/png",
      margin: 1,
      errorCorrectionLevel: "M",
      // Big enough to print sharply; a card-sized code is ~300dpi at this size.
      width: 1024,
    }),
  ]);

  return {
    slug,
    source,
    campaign,
    readable: readable.toString(),
    sneaky: `${SITE_ORIGIN}/go/p/${linkToken}`,
    qrLink,
    qrSvg,
    qrPng,
  };
}
