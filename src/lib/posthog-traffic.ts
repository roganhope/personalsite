import "server-only";

// The admin panel's copy of two charts from the "Campaign & Traffic Tracking"
// PostHog dashboard (project 535257, dashboard 1945665). Each tile is the same
// TrendsQuery the saved insight runs, sent to the query API with
// filterTestAccounts on, so the numbers and the internal/family exclusion
// match the dashboard exactly rather than being re-derived in HogQL.

export type TrafficSeries = {
  label: string;
  days: string[];
  data: number[];
  // Shown in the legend: PostHog's aggregated_value when it sends one (it
  // doesn't for line graphs), otherwise the sum of the per-day `data`.
  total: number;
};

export type TrafficTile =
  | { ok: true; series: TrafficSeries[] }
  | { ok: false; error: string };

export type TrafficTiles = {
  activity: TrafficTile;
  utmOverTime: TrafficTile;
};

type Display = "ActionsLineGraph";

type SeriesSpec = {
  event: string;
  math: string;
  name?: string;
};

const PAGEVIEW = "$pageview";
const NULL_BREAKDOWN = "$$_posthog_breakdown_null_$$";
const OTHER_BREAKDOWN = "$$_posthog_breakdown_other_$$";

function apiHost() {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.replace(/\/$/, "") ??
    "https://us.posthog.com"
  );
}

function trends(options: {
  series: SeriesSpec[];
  display: Display;
  interval: "day" | "week";
  dateFrom: string;
  breakdown?: string;
}) {
  return {
    kind: "TrendsQuery",
    series: options.series.map((spec) => ({ kind: "EventsNode", ...spec })),
    interval: options.interval,
    dateRange: { date_from: options.dateFrom },
    filterTestAccounts: true,
    trendsFilter: { display: options.display },
    ...(options.breakdown && {
      breakdownFilter: {
        breakdowns: [{ type: "event", property: options.breakdown }],
        breakdown_type: "event",
      },
    }),
  };
}

const visitors = (name = "Visitors"): SeriesSpec => ({
  event: PAGEVIEW,
  math: "dau",
  name,
});

const QUERIES = {
  activity: trends({
    series: [
      visitors("Unique visitors"),
      { event: PAGEVIEW, math: "total", name: "Pageviews" },
    ],
    display: "ActionsLineGraph",
    interval: "day",
    dateFrom: "-30d",
  }),
  utmOverTime: trends({
    series: [visitors()],
    display: "ActionsLineGraph",
    interval: "day",
    dateFrom: "-30d",
    breakdown: "utm_source",
  }),
};

// A breakdown value that was never set comes back as a sentinel string, not
// null, so name it here instead of printing the sentinel.
function breakdownLabel(result: Record<string, unknown>) {
  const value = Array.isArray(result.breakdown_value)
    ? result.breakdown_value[0]
    : result.breakdown_value;

  if (value === undefined) return String(result.label ?? "—");
  if (value === NULL_BREAKDOWN || value === "" || value === null) return "(none)";
  if (value === OTHER_BREAKDOWN) return "Other";
  return String(value);
}

function toSeries(result: Record<string, unknown>, hasBreakdown: boolean) {
  const data = Array.isArray(result.data) ? result.data.map(Number) : [];
  const aggregated = Number(result.aggregated_value);

  // `label` is the event name, so two series on $pageview would both read
  // "$pageview"; the name we gave each series comes back as custom_name.
  const action = result.action as { custom_name?: unknown } | undefined;
  const seriesName = action?.custom_name ?? result.label ?? "—";

  return {
    label: hasBreakdown ? breakdownLabel(result) : String(seriesName),
    days: Array.isArray(result.days) ? result.days.map(String) : [],
    data,
    total: Number.isFinite(aggregated)
      ? aggregated
      : data.reduce((sum, n) => sum + n, 0),
  } satisfies TrafficSeries;
}

async function runTile(
  query: ReturnType<typeof trends>,
  credentials: { apiKey: string; projectId: string }
): Promise<TrafficTile> {
  try {
    const response = await fetch(
      `${apiHost()}/api/projects/${credentials.projectId}/query/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
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

    const hasBreakdown = "breakdownFilter" in query;
    return {
      ok: true,
      series: body.results.map((result: Record<string, unknown>) =>
        toSeries(result, hasBreakdown)
      ),
    };
  } catch {
    return { ok: false, error: "Couldn't reach PostHog." };
  }
}

// Never throws, and one failing tile doesn't blank the others — the admin
// panel's job is minting links, so analytics trouble has to stay local.
export async function fetchTrafficTiles(): Promise<TrafficTiles> {
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;

  if (!apiKey || !projectId) {
    const missing: TrafficTile = {
      ok: false,
      error:
        "Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID to see traffic.",
    };
    return {
      activity: missing,
      utmOverTime: missing,
    };
  }

  const credentials = { apiKey, projectId };
  const [activity, utmOverTime] = await Promise.all([
    runTile(QUERIES.activity, credentials),
    runTile(QUERIES.utmOverTime, credentials),
  ]);

  return { activity, utmOverTime };
}
