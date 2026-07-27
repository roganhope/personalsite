# Coming Soon Page — Design

## Purpose
Stand up the personal blog project (hoperogan.com) as a bare "coming soon" placeholder. No blog functionality yet — this is just the initial scaffold and landing page.

## Stack
- Next.js (latest, App Router)
- TypeScript
- Tailwind CSS
- ESLint (create-next-app default)
- npm as package manager
- No `src/` directory — keep the tree flat given the project's current size
- Default import alias (`@/*`)

## Scope
- `create-next-app` scaffold in the existing repo root (`/Users/hope/Documents/code/personalsite`), which currently contains only a `README.md` and `.git`.
- `app/page.tsx`: single centered block of text reading "hoperogan.com coming soon." Plain text, no color styling beyond default black/white, system font stack (Tailwind default), no dark mode toggle, no additional components or links.
- `app/layout.tsx`: minimal metadata — title "hoperogan.com", a short placeholder description.
- Remove all default Next.js boilerplate (starter logo, links, instructions).
- No deployment wiring (no Vercel project linking) — the app should simply be deploy-ready by virtue of being a standard Next.js app.

## Out of scope
- Blog post schema, CMS, MDX, routing for future posts
- Dark mode / theme toggle
- Any analytics, fonts beyond Tailwind defaults, or custom design
- Actual deployment to Vercel (user will do this separately)

## Testing / verification
- `npm run dev` starts cleanly and the page renders the coming-soon text centered on screen.
- `npm run build` succeeds with no type or lint errors.
