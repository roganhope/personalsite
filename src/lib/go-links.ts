// Single source of truth for /go link destinations and attribution vocab.
// Plain data only — no secrets — so the admin panel's client components can
// import it too. Adding a destination is a one-line entry here; the redirect
// route and the admin dropdown both pick it up.
export const destinations: Record<string, string> = {
  github: "https://github.com/roganhope",
  linkedin: "https://www.linkedin.com/in/hoperogan/",
  "linkedin-from-github": "https://www.linkedin.com/in/hoperogan/",
  maiscribe: "https://github.com/roganhope/maiscribe",
  // Special-cased in resolveDestination: the one destination that forwards
  // attribution, since posthog-js reads utm_* off the landing pageview.
  site: "https://hoperogan.com/",
};

// Canonical source values, so `s` doesn't drift into email / email-sig /
// signature. The admin panel offers these plus a free-text escape hatch.
export const sources = [
  "email",
  "linkedin",
  "github",
  "resume",
  "chat",
  "apply",
] as const;

// Sources we hand links out from, mapped to the UTM medium that describes the
// channel. An unlisted source still works and simply arrives without a medium.
export const mediums: Record<string, string> = {
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
  const url = new URL(destinations.site);

  if (source) {
    url.searchParams.set("utm_source", source);
    const medium = mediums[source];
    if (medium) url.searchParams.set("utm_medium", medium);
  }

  if (campaign) url.searchParams.set("utm_campaign", campaign);

  return url.toString();
}

// The `site` check must come before the map lookup: `site` is listed in
// `destinations` for the admin dropdown, but its redirect carries UTMs.
export function resolveDestination(
  slug: string,
  source: string | null,
  campaign: string | null
) {
  if (slug === "site") return siteDestination(source, campaign);
  return destinations[slug] ?? null;
}
