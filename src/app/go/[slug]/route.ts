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
// /go/github?s=resume&c=pogo-full-stack. The destinations are third-party
// sites that never report their analytics back to us, so these are recorded
// on the PostHog event rather than forwarded to the destination.
function attribution(searchParams: URLSearchParams, ...keys: string[]) {
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
  const destination = redirects[slug];

  if (!destination) {
    return new Response("Not found", { status: 404 });
  }

  // Mail providers and chat apps fetch every link in a message before a human
  // ever sees it, which would otherwise land here as a click.
  if (!userAgent(request).isBot) {
    const { searchParams } = request.nextUrl;
    const distinctId = distinctIdFor(request);
    const properties = {
      slug,
      source: attribution(searchParams, "s", "utm_source"),
      campaign: attribution(searchParams, "c", "utm_campaign"),
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
