import { PostHog } from "posthog-node";
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const destination = redirects[slug];

  if (!destination) {
    return new Response("Not found", { status: 404 });
  }

  const { searchParams } = request.nextUrl;

  const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });

  client.capture({
    distinctId: "anonymous",
    event: "link_click",
    properties: {
      slug,
      source: attribution(searchParams, "s", "utm_source"),
      campaign: attribution(searchParams, "c", "utm_campaign"),
      referrer: request.headers.get("referer") ?? null,
    },
  });

  await client.shutdown();

  return Response.redirect(destination, 307);
}
