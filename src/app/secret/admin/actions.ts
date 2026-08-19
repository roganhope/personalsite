"use server";

import { cookies } from "next/headers";
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

  const token = await encryptLinkToken({ slug, source, campaign });

  return {
    slug,
    source,
    campaign,
    readable: readable.toString(),
    sneaky: `${SITE_ORIGIN}/go/p/${token}`,
  };
}
