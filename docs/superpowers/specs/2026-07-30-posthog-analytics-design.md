# PostHog Analytics — Design

## Purpose
Add PostHog product analytics to the site: automatic pageview/autocapture tracking, routed through the site's own domain (not PostHog's) so ad blockers don't drop it, plus three custom events for the interactions autocapture can't label well on its own — which skill got clicked, which project link, and contact form completion.

## Components

### `next.config.ts` — reverse proxy
The site is single-page (one route, `/`, plus `not-found.tsx`), so there's no client-side route transition to account for — just a straightforward rewrite-based proxy, per Next's own guidance to prefer `rewrites()` over a `proxy.ts` file when no per-request logic is needed:

```ts
async rewrites() {
  return [
    { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
    { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
  ];
},
skipTrailingSlashRedirect: true,
```

### `package.json`
Add `posthog-js` as a dependency. `posthog-js/react`'s context provider isn't needed — nothing here uses feature flags or hooks, and the library's default export is a ready-to-use singleton, so components call `posthog.capture(...)` directly.

### `src/components/posthog-provider.tsx` (new)
Client component, no props, renders nothing. Runs `posthog.init` once in a `useEffect` with an empty dependency array:

```ts
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
});
posthog.register({ environment: process.env.NODE_ENV });
```

`api_host: "/ingest"` sends all capture traffic through the rewrite above. `ui_host` keeps the PostHog toolbar/session-recording links pointing at the real host. The `environment` super property tags every event `"development"` or `"production"` so dev traffic (tracked per your call to run in all environments) can be filtered out of insights without disabling capture outright.

### `src/app/layout.tsx`
Mount `<PostHogProvider />` as a sibling before `<AnimatedGrid />`, inside `<body>`. No wrapping needed since nothing depends on React context.

### `src/components/skills.tsx`
Already a client component. Add `onClick` to each `<File>`:
```ts
onClick={() => posthog.capture("skill_clicked", { skill, category: category.label })}
```

### `src/components/projects.tsx`
Currently a server component; the static `projects` data (from `src/lib/content.ts`) doesn't depend on server-only APIs, so convert it to a client component (`"use client"`) to support the click handler. Add `onClick` to the project `<a>`:
```ts
onClick={() => posthog.capture("project_link_clicked", { project: project.title, href: project.href })}
```

### `src/components/contact-form.tsx`
Add a `useEffect` watching `state.succeeded`; when it flips to `true`, call `posthog.capture("contact_form_submitted")` once.

### Everything else
Nav links, the hero CTA, the "Collapse all" buttons, and any future `<button>`/`<a>` are covered by PostHog's `autocapture` (on by default) — it records click events with element text and attributes automatically, no code required.

## Out of scope
- `proxy.ts` / Next's Proxy file convention (this is a request-transparent rewrite, not conditional per-request logic)
- Manual pageview/route-change tracking (single-page site — the default pageview capture on init is sufficient)
- `posthog-js/react` provider, feature flags, session replay config
- `.env.example` (two vars, already documented here and in `.env.local`)
- Suppressing capture in local development (explicitly wanted in all environments, tagged instead)

## Deployment
`.env.local` covers local dev only. `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` also need to be added to the production host's environment variables (e.g. the Vercel project settings) or the deployed site will build without them and analytics will no-op.

## Testing / verification
- `npm run dev`: open the site, confirm a pageview event and `$autocapture` click events appear in PostHog's Activity view, tagged `environment: "development"`.
- Click a skill in the Skill Tree, a project card link, and submit the contact form — confirm `skill_clicked`, `project_link_clicked`, and `contact_form_submitted` each appear with the expected properties.
- Check the Network tab: analytics requests go to `/ingest/...` on the site's own origin, not directly to `posthog.com`.
- `npm run build` succeeds with no type or lint errors.
