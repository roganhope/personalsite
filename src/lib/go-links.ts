// Single source of truth for /go link destinations and attribution vocab.
// Plain data only — no secrets — so the admin panel's client components can
// import it too. Adding a destination is a one-line entry here; the redirect
// route and the admin dropdown both pick it up.
export const destinations: Record<
  string,
  { url: string; description: string; legacy?: true }
> = {
  github: {
    url: "https://github.com/roganhope",
    description: "GitHub profile",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/hoperogan/",
    description: "LinkedIn profile",
  },
  "linkedin-from-github": {
    url: "https://www.linkedin.com/in/hoperogan/",
    description: "LinkedIn profile — slug for links already shared from GitHub",
    // Kept alive for already-shared links; don't mint new ones with it.
    legacy: true,
  },
  maiscribe: {
    url: "https://github.com/roganhope/maiscribe",
    description: "maiscribe repo",
  },
  site: {
    // Special-cased in resolveDestination: the one destination that forwards
    // attribution, since posthog-js reads utm_* off the landing pageview.
    url: "https://hoperogan.com/",
    description: "This site — forwards source/campaign as real UTMs",
  },
};

// Legacy one-off routes that predate /go and stay alive for already-shared
// links. They have their own route files rather than slugs; listed here only
// so the admin inventory is complete.
export const legacyRoutes: {
  path: string;
  url: string;
  description: string;
}[] = [
  {
    path: "/home",
    url: "https://hoperogan.com/?utm_source=lc&utm_medium=direct&utm_campaign=home",
    description: "Vanity chat link with hardcoded UTMs (src/app/home/route.ts)",
  },
];

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
function siteDestination(
  source: string | null,
  campaign: string | null,
  origin?: string
) {
  // In development, land on the local site instead of prod so the whole
  // flow — redirect, attributed pageview, UTM strip — is testable without
  // deploying.
  const base =
    process.env.NODE_ENV === "development" && origin
      ? origin
      : destinations.site.url;
  const url = new URL(base);

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
  campaign: string | null,
  origin?: string
) {
  if (slug === "site") return siteDestination(source, campaign, origin);
  return destinations[slug]?.url ?? null;
}
