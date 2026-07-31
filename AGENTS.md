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

## Syncing skills and links from github.com/roganhope/roganhope

The source of truth for skills and social links lives in the (public)
`roganhope/roganhope` GitHub profile repo, not in this codebase. When asked
to update skills or links, fetch the latest data from there rather than
editing values from memory:

```bash
curl -s https://raw.githubusercontent.com/roganhope/roganhope/main/skills.json
curl -s https://raw.githubusercontent.com/roganhope/roganhope/main/links.json
```

- **`skills.json`** — array of `{ label, skills: [{ name, icon, logo, color,
  logoColor, include }] }` categories. Maps to `skillCategories` in
  `src/lib/content.ts` (currently just `{ label, skills: string[] }` — only
  `name` values are used today; only include skills where `include` is
  true). The `icon` filename should exist in `public/skill-icons/` and be
  wired into the `skillIcons` map in `src/components/skills.tsx` — flag any
  skill whose icon file is missing so it can be added.
- **`links.json`** — flat `{ discord, website, linkedin, github, ... }`
  object of social/profile URLs. Maps to the hardcoded `<a>` tags in
  `src/components/site-footer.tsx` (currently only LinkedIn and GitHub are
  present — add/update entries to match, using `src/components/icons.tsx`
  for icons, adding new icon components if needed).

When asked to "update skills," "sync links," or similar, pull both files,
diff them against the current local values, and apply the changes to the
files above — don't touch `roganhope/roganhope` itself unless explicitly
asked.
