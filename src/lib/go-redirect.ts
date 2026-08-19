import { PostHog } from "posthog-node";
import { after, userAgent } from "next/server";
import type { NextRequest } from "next/server";

// Attribution params read off an incoming /go URL, e.g.
// /go/github?s=resume&c=pogo-full-stack. Most destinations are third-party
// sites that never report their analytics back to us, so these are recorded
// on the PostHog event rather than forwarded to the destination.
export function attribution(searchParams: URLSearchParams, ...keys: string[]) {
  for (const key of keys) {
    const value = searchParams.get(key)?.replace(/[`\s]/g, "").slice(0, 100);
    if (value) return value;
  }
  return null;
}

// posthog-js writes its distinct_id into this cookie on our own domain, so a
// visitor who has been here before keeps the same identity on the click.
// Everyone else gets a fresh id, which overcounts repeat clickers but beats a
// single shared id that collapses every click in the project into one person.
// `knownVisitor` records which of the two happened, so a click on a shared
// link can be judged in PostHog: a known device is probably the person the
// link was minted for; a fresh id could be anyone it was forwarded to.
function distinctIdFor(request: NextRequest) {
  const cookie = request.cookies.get(
    `ph_${process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN}_posthog`
  )?.value;

  if (cookie) {
    try {
      const { distinct_id } = JSON.parse(decodeURIComponent(cookie));
      if (typeof distinct_id === "string") {
        return { distinctId: distinct_id, knownVisitor: true };
      }
    } catch {
      // Malformed cookie; fall through to a fresh id.
    }
  }

  return { distinctId: crypto.randomUUID(), knownVisitor: false };
}

// The one way a tracked link resolves: capture a link_click (unless the
// clicker is a bot) and 307 to the destination. Shared by /go/[slug] and
// /go/p/[token] so both link forms record identical events.
export function trackAndRedirect(
  request: NextRequest,
  {
    slug,
    source,
    campaign,
    destination,
  }: {
    slug: string;
    source: string | null;
    campaign: string | null;
    destination: string;
  }
) {
  // Mail providers and chat apps fetch every link in a message before a human
  // ever sees it, which would otherwise land here as a click.
  if (!userAgent(request).isBot) {
    const { distinctId, knownVisitor } = distinctIdFor(request);
    const properties = {
      slug,
      source,
      campaign,
      referrer: request.headers.get("referer") ?? null,
      known_visitor: knownVisitor,
      environment: process.env.NODE_ENV,
    };

    after(async () => {
      const client = new PostHog(
        process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!,
        { host: process.env.NEXT_PUBLIC_POSTHOG_HOST }
      );

      client.capture({ distinctId, event: "link_click", properties });

      await client.shutdown();
    });
  }

  return Response.redirect(destination, 307);
}
