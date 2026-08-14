<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Regenerating the hero gif

`public/hero.gif` is a recording of the hero intro animation (heading typing
+ tagline fade-in only — no navbar, no button). To regenerate it:

1. Run `npm run dev` in the background.
2. Use Playwright (`npm install --no-save --no-package-lock playwright` if
   not already available) to load the page, remove the `<header>` and the
   button's wrapper div via `page.evaluate`, then capture a PNG frame
   sequence clipped to the hero content's bounding box at ~30fps for the
   duration of the animation (heading done + tagline fade, ~4.7s).
3. Encode the frames to a gif with ffmpeg using a two-pass palette
   (`palettegen` / `paletteuse`) for quality, scaled to ~800px wide.
4. Before saving over `public/hero.gif`, ask whether to delete the old gif
   or keep it and store the new one under a different filename.

## Syncing skills and links from github.com/roganhope/resumes

The source of truth for skills (and, once added, social links) lives in the
`src/content/` folder of the (private) `roganhope/resumes` GitHub repo, not
in this codebase. Because the repo is private, use `gh api` rather than
plain `curl` to fetch files:

```bash
gh api repos/roganhope/resumes/contents/src/content/skills.json -H "Accept: application/vnd.github.raw"
gh api repos/roganhope/resumes/contents/src/content/links.json -H "Accept: application/vnd.github.raw"
gh api repos/roganhope/resumes/contents/src/content/icons --jq '.[].name'
```

- **`skills.json`** — array of `{ label, skills: [{ name, icon, logo, color,
  logoColor, include }] }` categories. Maps to `skillCategories` in
  `src/lib/content.ts` (currently just `{ label, skills: string[] }` — only
  `name` values are used today; only include skills where `include` is
  true). The `icon` filename should exist in `public/skill-icons/` — if
  missing, fetch it from `src/content/icons/` in the resumes repo (e.g. `gh
  api repos/roganhope/resumes/contents/src/content/icons/<file> -H "Accept:
  application/vnd.github.raw"`) and wire it into the `skillIcons` map in
  `src/components/skills.tsx`.
- **`links.json`** — not present in the resumes repo yet (as of 2026-07-31);
  the user plans to add it there. Once it exists, treat it as a flat
  `{ discord, website, linkedin, github, ... }` object of social/profile
  URLs, mapping to the hardcoded `<a>` tags in `src/components/site-footer.tsx`
  (currently only LinkedIn and GitHub are present — add/update entries to
  match, using `src/components/icons.tsx` for icons, adding new icon
  components if needed). Until it exists, skip links syncing.

Only sync when explicitly asked ("update skills," "sync links," or similar)
— never proactively. Pull the relevant file(s), diff against the current
local values, and apply the changes to the files above — don't touch
`roganhope/resumes` itself unless explicitly asked.

## PostHog: traffic source dashboard

Dashboard at https://us.posthog.com/project/535257/dashboard/1945665 tracks
who is visiting the site and where they're coming from (referrer, UTM source,
etc.). Created to understand traffic attribution for the redirect/tracking
work on the `go/[slug]` routes.

## Tagging a `/go` link with a source and campaign

`/go/<slug>` accepts optional `s` (source) and `c` (campaign) query params,
recorded as the `source` and `campaign` properties on the `link_click` event:

```
https://hoperogan.com/go/github?s=resume&c=pogo-full-stack
https://hoperogan.com/go/linkedin?s=resume&c=acme-staff-eng
```

`utm_source` / `utm_campaign` work as aliases if the longer form reads better
somewhere; `s` / `c` win if both are present. Both params are optional — links
without them keep working and record `null`.

Use one campaign value per resume/application so applications can be told
apart in PostHog, and keep reusing the same `github` / `linkedin` slugs rather
than minting a new slug per application (`linkedin-from-github` predates this
and stays for the already-shared links).

The params are only ever recorded on the PostHog event, never appended to the
destination — GitHub and LinkedIn don't report their analytics back to us, so
UTMs on those URLs would do nothing.
