<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Colors and dark mode

Every color on the site comes from a custom property in `src/app/globals.css`.
`:root` holds the light values, `[data-theme="dark"]` overrides them, and
`@theme inline` re-exposes each one as a Tailwind utility — so `bg-surface`,
`text-eyebrow`, `shadow-card` and friends retint themselves when the attribute
flips. **Don't put a raw hex or a stock Tailwind palette color in a component**;
add a token pair instead, or the element will be stuck in one theme.

Tokens beyond the obvious `ink` / `paper` / `muted` / `line` / `pink`:

- `surface` (translucent card fill, lets the animated grid through),
  `surface-solid` (opaque — inputs, tables), `surface-sunken` (image wells),
  `surface-hover`, `tint` (whole-section wash)
- `eyebrow` (the uppercase section labels), `body` (the hero paragraph)
- `line-strong` (hover borders), `grid-line` (`AnimatedGrid`'s hairlines)
- `footer` / `footer-ink` — the footer keeps its own pair so it stays a distinct
  bar instead of blending into the page in dark mode
- `on-accent` — text on a pink fill; stays dark in both themes
- `shadow-card` / `shadow-card-hover`

Anything sitting on `bg-ink` should use `text-paper`, not `text-white`: both
tokens invert, so the pairing stays legible in either theme.

The visitor's preference is `system` (the default), `light`, or `dark`, stored
in `localStorage.theme`. Two places resolve it to a concrete `data-theme` on
`<html>` and **must be kept in step**: the inline pre-paint script in
`src/app/layout.tsx` (which runs before the first paint, so there's no flash)
and `resolveTheme` in `src/components/theme-toggle.tsx`. The toggle itself is
the three-way pill in the footer; it reads through `useSyncExternalStore`, so
it also picks up changes made in another tab. Because resolution is script-
driven, a visitor with JS disabled always gets the light theme.

Flat-black logos in `public/skill-icons/` would vanish on a dark card, so
`monochromeIcons` in `src/components/skills.tsx` lists the ones that get
`dark:invert`. Add to that set when a new icon has no color of its own.

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
  (currently email, LinkedIn, GitHub, and Discord — add/update entries to
  match, using `src/components/icons.tsx` for icons, adding new icon
  components if needed). The email address itself is the `EMAIL` constant in
  `src/lib/content.ts`, not a literal in the footer. Until `links.json` exists,
  skip links syncing.

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

Destinations, canonical sources, and the source→medium map all live in
`src/lib/go-links.ts` — adding a new destination (a specific repo, an app,
etc.) is one line in its `destinations` map, and both the redirect route and
the `/secret/admin` dropdown pick it up automatically. The capture/redirect
logic shared by both link forms lives in `src/lib/go-redirect.ts`.

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

### `/go/site` — the one destination that forwards attribution

`site` is a special slug pointing at hoperogan.com itself, and it *does* forward
the params, as real UTMs:

```
/go/site?s=email                    -> /?utm_source=email&utm_medium=email
/go/site?s=resume&c=pogo-full-stack -> /?utm_source=resume&utm_medium=document
                                        &utm_campaign=pogo-full-stack
```

Forwarding is right here because posthog-js reads `utm_*` off the landing
pageview on its own. **Trust that pageview, not the `link_click` event**: a
pageview needs a real browser running JS, so mail and chat link scanners can't
inflate it, whereas they can and do hit the redirect.

`utm_medium` is filled in from the source→medium map in `src/lib/go-links.ts`
so PostHog can classify the channel. An unlisted source still works and simply
arrives with no medium, so new sources need no code change.

The forwarded UTMs don't linger: `src/components/posthog-provider.tsx`
captures the landing pageview by hand and then strips `utm_*` from the
address bar, so the visitor just sees a clean hoperogan.com.

Canonical source values — reuse these rather than inventing spellings, so `s`
doesn't drift into `email` / `email-sig` / `signature`:

`email` (signature) · `linkedin` · `github` · `resume` · `chat` · `apply`

### `/go/p/<token>` — sneaky links

`/go/p/<token>` carries the destination slug, source, and campaign inside an
AES-256-GCM token keyed off `LINK_SECRET`, so a link minted for one person
(e.g. a recruiter chat) reveals nothing about what it records. There is no
link store — the token *is* the data — so minted links survive deploys and
can't be listed or revoked. Never hand-construct one; mint them at
`/secret/admin`. Bad or stale tokens 307 to hoperogan.com without recording
anything, and query params on a `/go/p` URL are ignored. Clicks record the
same `link_click` event as `/go/<slug>`.

Sneaky links don't change the analytic unit: the campaign property (person,
application) is still what tells clicks apart — the rule against minting new
slugs per application stands.

### `/secret/admin` — the link builder

Password login (`ADMIN_PASSWORD`) sets a 30-day HMAC-signed httpOnly cookie
(`SESSION_SECRET`); the form then mints both link forms for any
destination/source/campaign combo. Auth is enforced inside every server
action — `src/proxy.ts` only backstops the `/secret` subtree — and the page
is noindexed. Generated-link history is localStorage-only convenience.

Three server-only env vars back this (see `.env.example`): `ADMIN_PASSWORD`,
`SESSION_SECRET` (rotate freely — logs devices out), and `LINK_SECRET`
(rotating it silently kills every sneaky link already sent — don't). All
three must be set in Vercel for the panel and `/go/p` links to work in prod.

### What the routes do with bots and identity

Requests from self-identifying bots are redirected but **not** recorded, since
mail providers and chat apps fetch every link in a message before a human sees
it. `link_click` counts are still an upper bound — scanners posing as browsers
get through. Clicks are attributed to posthog-js's `distinct_id` cookie when the
visitor has been to the site before, and to a fresh id otherwise; the event's
`known_visitor` property records which of the two happened, so a click on a
shared/forwarded link can be judged for whether it's plausibly the person the
link was minted for. Events also carry `environment` so dev clicks are
filterable.
