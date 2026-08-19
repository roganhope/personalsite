import { PostHog } from "posthog-node";
import { after, userAgent } from "next/server";
import type { NextRequest } from "next/server";

const redirects: Record<string, string> = {
  github: "https://github.com/roganhope",
  linkedin: "https://www.linkedin.com/in/hoperogan/",
  "linkedin-from-github": "https://www.linkedin.com/in/hoperogan/",
  maiscribe: "https://github.com/roganhope/maiscribe",
};

// Attribution params read off the incoming /go URL, e.g.
// /go/github?s=resume&c=pogo-full-stack. The destinations above are
// third-party sites that never report their analytics back to us, so these are
// recorded on the PostHog event rather than forwarded to the destination.
function attribution(searchParams: URLSearchParams, ...keys: string[]) {
  for (const key of keys) {
    const value = searchParams.get(key)?.replace(/[`\s]/g, "").slice(0, 100);
    if (value) return value;
  }
  return null;
}

// Sources we hand links out from, mapped to the UTM medium that describes the
// channel. An unlisted source still works and simply arrives without a medium.
const mediums: Record<string, string> = {
  email: "email",
  apply: "email",
  linkedin: "social",
  github: "social",
  resume: "document",
  chat: "chat",
};

// Our own site is the one destination worth forwarding attribution to, since
// posthog-js reads utm_* off the landing pageview by itself. That pageview
// needs a real browser running JS, which is why it — not the link_click event
// — is the trustworthy number for traffic arriving here.
function siteDestination(source: string | null, campaign: string | null) {
  const url = new URL("https://hoperogan.com/");

  if (source) {
    url.searchParams.set("utm_source", source);
    const medium = mediums[source];
    if (medium) url.searchParams.set("utm_medium", medium);
  }

  if (campaign) url.searchParams.set("utm_campaign", campaign);

  return url.toString();
}

// posthog-js writes its distinct_id into this cookie on our own domain, so a
// visitor who has been here before keeps the same identity on the click.
// Everyone else gets a fresh id, which overcounts repeat clickers but beats a
// single shared id that collapses every click in the project into one person.
function distinctIdFor(request: NextRequest) {
  const cookie = request.cookies.get(
    `ph_${process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN}_posthog`
  )?.value;

  if (cookie) {
    try {
      const { distinct_id } = JSON.parse(decodeURIComponent(cookie));
      if (typeof distinct_id === "string") return distinct_id;
    } catch {
      // Malformed cookie; fall through to a fresh id.
    }
  }

  return crypto.randomUUID();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = request.nextUrl;
  const source = attribution(searchParams, "s", "utm_source");
  const campaign = attribution(searchParams, "c", "utm_campaign");

  const destination =
    slug === "site" ? siteDestination(source, campaign) : redirects[slug];

  if (!destination) {
    return new Response("Not found", { status: 404 });
  }

  // Mail providers and chat apps fetch every link in a message before a human
  // ever sees it, which would otherwise land here as a click.
  if (!userAgent(request).isBot) {
    const distinctId = distinctIdFor(request);
    const properties = {
      slug,
      source,
      campaign,
      referrer: request.headers.get("referer") ?? null,
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
