import { PostHog } from "posthog-node";
import type { NextRequest } from "next/server";

const redirects: Record<string, string> = {
  github: "https://github.com/roganhope",
  linkedin: "https://www.linkedin.com/in/hoperogan/",
  "linkedin-from-github": "https://www.linkedin.com/in/hoperogan/",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const destination = redirects[slug];

  if (!destination) {
    return new Response("Not found", { status: 404 });
  }

  const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });

  client.capture({
    distinctId: "anonymous",
    event: "link_click",
    properties: {
      slug,
      referrer: request.headers.get("referer") ?? null,
    },
  });

  await client.shutdown();

  return Response.redirect(destination, 307);
}
