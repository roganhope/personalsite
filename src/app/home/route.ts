import { PostHog } from "posthog-node";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });

  client.capture({
    distinctId: "anonymous",
    event: "link_click",
    properties: {
      slug: "home",
      referrer: request.headers.get("referer") ?? null,
    },
  });

  await client.shutdown();

  return Response.redirect(
    "https://hoperogan.com/?utm_source=lc&utm_medium=direct&utm_campaign=home",
    307
  );
}
