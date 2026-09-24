import "server-only";

// Reads link_click back out of PostHog for the admin panel. This is the only
// place the site queries analytics rather than writing to it, so the personal
// API key it needs stays server-side and separate from the public project
// token used for capture.

export type LinkStat = {
  slug: string;
  campaign: string | null;
  scans: number;
  clicks: number;
  lastUsed: string | null;
  knownVisitors: number;
  total: number;
};

// An explicit `ok` discriminant rather than a nullable error: narrowing on a
// string's truthiness can't rule out an empty one, so TypeScript won't let a
// caller reach `stats` without it.
export type LinkStatsResult =
  | { ok: true; stats: LinkStat[] }
  | { ok: false; error: string };

// countIf(properties.known_visitor) would fail: JSON properties come back as
// strings, so the boolean has to be compared as one.
const STATS_QUERY = `
  SELECT
    properties.slug AS slug,
    properties.campaign AS campaign,
    countIf(properties.format = 'qr') AS scans,
    countIf(properties.format != 'qr') AS clicks,
    max(timestamp) AS last_used,
    countIf(toString(properties.known_visitor) = 'true') AS known_visitors,
    count() AS total
  FROM events
  WHERE event = 'link_click'
    AND properties.environment = 'production'
  GROUP BY slug, campaign
  ORDER BY last_used DESC
  LIMIT 200
`;

function apiHost() {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.replace(/\/$/, "") ??
    "https://us.posthog.com"
  );
}

// A row arrives as a positional array in the column order of STATS_QUERY.
function toStat(row: unknown[]): LinkStat {
  const [slug, campaign, scans, clicks, lastUsed, knownVisitors, total] = row;

  return {
    slug: String(slug ?? "—"),
    // An empty campaign is a link minted without one, not a campaign named "".
    campaign: campaign ? String(campaign) : null,
    scans: Number(scans ?? 0),
    clicks: Number(clicks ?? 0),
    lastUsed: lastUsed ? String(lastUsed) : null,
    knownVisitors: Number(knownVisitors ?? 0),
    total: Number(total ?? 0),
  };
}

// Never throws: the admin panel's job is minting links, and it must not go
// down because analytics is unreachable. Every failure comes back as a
// message the page can render in place of the table.
export async function fetchLinkStats(): Promise<LinkStatsResult> {
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;

  if (!apiKey || !projectId) {
    return {
      ok: false,
      error:
        "Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID to see link stats.",
    };
  }

  try {
    const response = await fetch(
      `${apiHost()}/api/projects/${projectId}/query/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: { kind: "HogQLQuery", query: STATS_QUERY },
        }),
        // Refreshing the admin page shouldn't re-run the query every time.
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return { ok: false, error: `PostHog returned ${response.status}.` };
    }

    const body = await response.json();
    if (!Array.isArray(body?.results)) {
      return {
        ok: false,
        error: "PostHog returned an unexpected response shape.",
      };
    }

    return { ok: true, stats: body.results.map(toStat) };
  } catch {
    return { ok: false, error: "Couldn't reach PostHog." };
  }
}
