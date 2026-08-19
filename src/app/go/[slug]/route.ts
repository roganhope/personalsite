import type { NextRequest } from "next/server";
import { resolveDestination } from "@/lib/go-links";
import { attribution, trackAndRedirect } from "@/lib/go-redirect";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = request.nextUrl;
  const source = attribution(searchParams, "s", "utm_source");
  const campaign = attribution(searchParams, "c", "utm_campaign");

  const destination = resolveDestination(slug, source, campaign);

  if (!destination) {
    return new Response("Not found", { status: 404 });
  }

  return trackAndRedirect(request, { slug, source, campaign, destination });
}
