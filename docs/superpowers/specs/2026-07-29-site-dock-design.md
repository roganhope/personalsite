# Site Dock — Design

## Purpose
Add a persistent, MacOS-style dock fixed to the bottom of the viewport, present on every page, giving quick access to: Home, GitHub, LinkedIn, and Email (which jumps to the Contact section rather than opening a mail client).

## Components

### `src/components/dock.tsx`
Generic `Dock` / `DockIcon` pair adapted from [MagicUI's Dock](https://magicui.design/docs/components/dock), trimmed the same way `magic-card.tsx` trims MagicCard: keep the `motion/react` magnification behavior (mouse-proximity scale via `useMotionValue`/`useTransform`/`useSpring`), but drop dependencies not present in this repo:
- No `class-variance-authority` — plain template-literal classNames instead of `cva`.
- No `@/lib/utils` `cn()` helper — doesn't exist in this project; not introduced for one component.
- No Radix Tooltip — icons get `aria-label` + native `title` instead.

Visual style matches the site's existing bold-graphic language (see `button.tsx`, `magic-card.tsx`) rather than MagicUI's glassy/dark-mode default: `border-ink`, white background, hard pink drop-shadow (`shadow-[4px_4px_0_var(--color-pink)]`), rounded-full container. `DockIcon` hover state fills pink, matching `Button`'s hover treatment.

API mirrors upstream: `Dock` takes `iconSize`, `iconMagnification`, `iconDistance`, `disableMagnification`, `direction`, `className`, `children`. `DockIcon` takes `size`, `magnification`, `distance`, `mouseX` (injected by `Dock` via `React.cloneElement`), `className`, `children`, plus it's rendered as a link (`href`, `target`, `rel`, `aria-label`) rather than a plain div, since every icon in this site's dock navigates somewhere.

### `src/components/site-dock.tsx`
The concrete instance rendered in the layout. Fixed-position wrapper (`fixed inset-x-0 bottom-6 z-50 flex justify-center`) containing a `<Dock>` with four `<DockIcon>`s:

| Icon | href | Notes |
|---|---|---|
| Home | `/#top` | Same target as the header logo link |
| GitHub | `https://github.com/roganhope` | `target="_blank" rel="noreferrer"`, same URL as footer |
| LinkedIn | `https://www.linkedin.com/in/hoperogan/` | `target="_blank" rel="noreferrer"`, same URL as footer |
| Email | `/#contact` | Scrolls to the Contact section — **not** a `mailto:` link |

### `src/components/icons.tsx`
Add `HomeIcon` and `MailIcon`, matching the existing 24×24 single-path filled-SVG style of `GitHubIcon`/`LinkedInIcon`. Give all four icon components an optional `className` prop (defaulting to each icon's current `h-[15px] w-[15px] fill-current`) so `SiteDock` can render them larger inside the dock without changing their existing footer usage.

## Mount point
Render `<SiteDock />` once in `src/app/layout.tsx` (alongside `AnimatedGrid`/`SitePointer`), not per-page. Because it's `position: fixed`, one instance at the root layout covers every route — home, 404, and any future page — without touching `page.tsx` or `not-found.tsx`, and satisfies "locked" (stays put on scroll).

## Out of scope
- Tooltips beyond native `title`/`aria-label`
- Dock visibility toggling per page/route
- Mobile-specific layout changes (dock uses the same fixed pill on all breakpoints)
- New npm dependencies

## Testing / verification
- `npm run dev`: dock renders fixed to the bottom of the viewport on `/` and a 404 route, magnification-on-hover works, and each icon navigates/links correctly (Home scrolls top, GitHub/LinkedIn open in new tabs, Email scrolls to Contact).
- `npm run build` succeeds with no type or lint errors.
