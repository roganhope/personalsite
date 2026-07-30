# PostHog Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PostHog analytics (autocapture + pageviews) to the site, routed through the site's own domain via a Next.js rewrite so ad blockers don't drop requests, plus three custom events (`skill_clicked`, `project_link_clicked`, `contact_form_submitted`) for interactions autocapture can't label well on its own.

**Architecture:** A `posthog.init()` call in a client component mounted once in the root layout, configured with `api_host: "/ingest"` so all traffic is proxied through `next.config.ts` rewrites to PostHog's real ingestion hosts. Three components (`skills.tsx`, `projects.tsx`, `contact-form.tsx`) each call `posthog.capture(...)` directly at their relevant interaction point — no shared analytics wrapper needed since `posthog-js`'s default export is already a ready-to-use singleton.

**Tech Stack:** `posthog-js` (new dependency), Next.js 16 `rewrites()` config, React 19 client components.

## Global Constraints

- Analytics runs in **all environments** (including local dev), not gated behind `NODE_ENV === "production"` — every event carries an `environment` super property (`"development"` or `"production"`) instead, so dev noise can be filtered in PostHog's UI without disabling capture.
- `api_host` must be `"/ingest"` (the proxy path), never PostHog's real host directly — that's the whole point of the reverse proxy (ad-blocker avoidance).
- `ui_host` must be the real PostHog host (`process.env.NEXT_PUBLIC_POSTHOG_HOST`) so the in-app toolbar/links resolve correctly.
- No `posthog-js/react` provider/context, no feature flags, no session replay config — none of that is needed for autocapture + three named events.
- No manual pageview/route-change tracking — the site is a single route (`/`, plus `not-found.tsx`), so `posthog-js`'s default pageview-on-init capture is sufficient.
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` already exist in `.env.local` (gitignored via the repo's existing `.env*` pattern) — don't recreate or commit them.
- No automated test suite exists in this repo (no jest/vitest/playwright in `package.json`); verification is `npm run lint`, `npm run build`, and manual checks via `npm run dev` in a browser plus PostHog's Activity view.

---

### Task 1: Reverse proxy + PostHog init

**Files:**
- Modify: `package.json` (via `npm install`)
- Modify: `next.config.ts`
- Create: `src/components/posthog-provider.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: the `posthog-js` singleton is initialized app-wide by the time any other component mounts. Tasks 2–4 use it via `import posthog from "posthog-js"; posthog.capture("event_name", { ...properties })` — no other setup required on their end.

- [ ] **Step 1: Install `posthog-js`**

Run: `npm install posthog-js`
Expected: `posthog-js` added to `dependencies` in `package.json` and `package-lock.json`.

- [ ] **Step 2: Add the reverse-proxy rewrites to `next.config.ts`**

Find:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

Replace with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
```

- [ ] **Step 3: Create `src/components/posthog-provider.tsx`**

```tsx
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
```

- [ ] **Step 4: Mount `PostHogProvider` in the root layout**

In `src/app/layout.tsx`, find:

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AnimatedGrid from "@/components/animated-grid";
import "./globals.css";
```

Replace with:

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AnimatedGrid from "@/components/animated-grid";
import PostHogProvider from "@/components/posthog-provider";
import "./globals.css";
```

Then find:

```tsx
      <body className="bg-paper font-sans text-base font-medium text-ink">
        <AnimatedGrid />
        {children}
      </body>
```

Replace with:

```tsx
      <body className="bg-paper font-sans text-base font-medium text-ink">
        <PostHogProvider />
        <AnimatedGrid />
        {children}
      </body>
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed with no type or lint errors.

- [ ] **Step 6: Manual check — proxy and pageview capture work**

Run: `npm run dev`, open the site in a browser with dev tools open on the Network tab.
Expected:
- Requests for analytics go to `/ingest/...` on `localhost`, not directly to `posthog.com` or `i.posthog.com`.
- In PostHog's Activity view (web app), a pageview event appears for this session within a few seconds, tagged with `environment: "development"`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json next.config.ts src/components/posthog-provider.tsx src/app/layout.tsx
git commit -m "Add PostHog analytics with reverse-proxy ingestion"
```

---

### Task 2: `contact_form_submitted` event

**Files:**
- Modify: `src/components/contact-form.tsx`

**Interfaces:**
- Consumes: the `posthog` singleton from Task 1 (`import posthog from "posthog-js"`).

- [ ] **Step 1: Fire the event when the form succeeds**

In `src/components/contact-form.tsx`, find:

```tsx
"use client";

import { useForm, ValidationError } from "@formspree/react";
import { useLayoutEffect, useRef, useState } from "react";
import { Confetti } from "./confetti";
```

Replace with:

```tsx
"use client";

import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { Confetti } from "./confetti";
```

Then find:

```tsx
  const [state, handleSubmit] = useForm("mqerjgvp");
  const formRef = useRef<HTMLFormElement>(null);
  const [formHeight, setFormHeight] = useState<number>();

  useLayoutEffect(() => {
    if (formRef.current) setFormHeight(formRef.current.offsetHeight);
  }, []);
```

Replace with:

```tsx
  const [state, handleSubmit] = useForm("mqerjgvp");
  const formRef = useRef<HTMLFormElement>(null);
  const [formHeight, setFormHeight] = useState<number>();

  useLayoutEffect(() => {
    if (formRef.current) setFormHeight(formRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    if (state.succeeded) posthog.capture("contact_form_submitted");
  }, [state.succeeded]);
```

- [ ] **Step 2: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 3: Manual check — event fires once on successful submit**

Run: `npm run dev`, scroll to the contact form, fill it out with valid values, and submit.
Expected: the confetti/thank-you state appears (existing behavior, unchanged), and `contact_form_submitted` appears in PostHog's Activity view for this session.

- [ ] **Step 4: Commit**

```bash
git add src/components/contact-form.tsx
git commit -m "Track contact form submissions in PostHog"
```

---

### Task 3: `project_link_clicked` event

**Files:**
- Modify: `src/components/projects.tsx`

**Interfaces:**
- Consumes: the `posthog` singleton from Task 1.

- [ ] **Step 1: Convert `projects.tsx` to a client component and add the click handler**

`projects.tsx` is currently a server component; the `projects` data it renders comes from a static import (`@/lib/content`), not a server-only data source, so converting it to a client component to support the click handler doesn't lose anything. Find:

```tsx
import Image from "next/image";
import Section from "./section";
import Wrap from "./wrap";
import { projects } from "@/lib/content";
```

Replace with:

```tsx
"use client";

import Image from "next/image";
import posthog from "posthog-js";
import Section from "./section";
import Wrap from "./wrap";
import { projects } from "@/lib/content";
```

Then find:

```tsx
                <a
                  href={project.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="relative mt-5 text-[.78rem] font-extrabold tracking-[.06em] uppercase after:absolute after:inset-0 after:content-['']"
                >
                  See the work ↗
                </a>
```

Replace with:

```tsx
                <a
                  href={project.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  onClick={() => posthog.capture("project_link_clicked", { project: project.title, href: project.href })}
                  className="relative mt-5 text-[.78rem] font-extrabold tracking-[.06em] uppercase after:absolute after:inset-0 after:content-['']"
                >
                  See the work ↗
                </a>
```

- [ ] **Step 2: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 3: Manual check — event fires with the right project**

Run: `npm run dev`, scroll to the Projects ("Some of my projects") section, click into a project card.
Expected: the link still navigates as before (existing behavior, unchanged), and `project_link_clicked` appears in PostHog's Activity view with `project` matching the clicked card's title and `href` matching its link.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects.tsx
git commit -m "Track project link clicks in PostHog"
```

---

### Task 4: `skill_clicked` event

**Files:**
- Modify: `src/components/skills.tsx`

**Interfaces:**
- Consumes: the `posthog` singleton from Task 1, and the `File` component's existing `onClick` prop passthrough (`src/components/magicui/file-tree.tsx:235-266` — the destructured `onClick` prop is invoked via `onClick?.(event)` on the underlying `<button>` — already forwards without any changes needed there).

- [ ] **Step 1: Import `posthog` and add the click handler to each `File`**

In `src/components/skills.tsx`, find:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { File, Folder, Tree } from "./magicui/file-tree";
import Section from "./section";
import Wrap from "./wrap";
import { skillCategories } from "@/lib/content";
```

Replace with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { File, Folder, Tree } from "./magicui/file-tree";
import Section from "./section";
import Wrap from "./wrap";
import { skillCategories } from "@/lib/content";
```

Then find:

```tsx
                {category.skills.map((skill) => (
                  <File
                    key={`${category.label}/${skill}`}
                    value={`${category.label}/${skill}`}
                    fileIcon={<SkillIcon skill={skill} />}
                  >
                    <span>{skill}</span>
                  </File>
                ))}
```

Replace with:

```tsx
                {category.skills.map((skill) => (
                  <File
                    key={`${category.label}/${skill}`}
                    value={`${category.label}/${skill}`}
                    fileIcon={<SkillIcon skill={skill} />}
                    onClick={() => posthog.capture("skill_clicked", { skill, category: category.label })}
                  >
                    <span>{skill}</span>
                  </File>
                ))}
```

- [ ] **Step 2: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 3: Manual check — event fires with the right skill and category**

Run: `npm run dev`, scroll to the Skill Tree, expand a category, click a skill (e.g. "Python" under "Languages").
Expected: the tree's existing select/expand behavior is unchanged, and `skill_clicked` appears in PostHog's Activity view with `skill: "Python"` and `category` matching that skill's category label.

- [ ] **Step 4: Commit**

```bash
git add src/components/skills.tsx
git commit -m "Track skill tree clicks in PostHog"
```
