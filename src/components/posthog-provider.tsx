"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

const attributionParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
];

// Attribution params exist for us, not for the visitor, so take them back out
// of the address bar once they've been recorded.
function stripAttributionFromUrl() {
  const url = new URL(window.location.href);

  if (!attributionParams.some((param) => url.searchParams.has(param))) {
    return;
  }

  for (const param of attributionParams) url.searchParams.delete(param);
  window.history.replaceState(null, "", url.toString());
}

export default function PostHogProvider() {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      // Captured by hand below so the pageview is provably sent before the URL
      // is rewritten. If this site ever grows past one page, client-side route
      // changes will need capturing here too.
      capture_pageview: false,
    });
    posthog.register({ environment: process.env.NODE_ENV });
    posthog.capture("$pageview");

    stripAttributionFromUrl();
  }, []);

  return null;
}
