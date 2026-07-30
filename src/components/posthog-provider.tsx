"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogProvider() {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    });
    posthog.register({ environment: process.env.NODE_ENV });
  }, []);

  return null;
}
