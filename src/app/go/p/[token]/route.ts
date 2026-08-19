import type { NextRequest } from "next/server";
import { destinations, resolveDestination } from "@/lib/go-links";
import { trackAndRedirect } from "@/lib/go-redirect";
import { decryptLinkToken } from "@/lib/link-crypto";

// Sneaky links minted by /secret/admin: the token carries the destination and
// attribution, so nothing about the link hints at what it records. Query
// params are ignored — the token wins.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const payload = await decryptLinkToken(token);

  // A mangled token is usually a link an email client truncated or rewrote;
  // land the human somewhere useful and keep the garbage out of analytics.
  if (!payload) {
    return Response.redirect(destinations.site.url, 307);
  }

  const { slug, source, campaign } = payload;
  const destination = resolveDestination(
    slug,
    source,
    campaign,
    request.nextUrl.origin
  );

  if (!destination) {
    return Response.redirect(destinations.site.url, 307);
  }

  return trackAndRedirect(request, { slug, source, campaign, destination });
}
