# Skill Tree — Collapse All — Design

## Purpose
The Skills section ("Skill Tree") renders a file-tree accordion of skill categories. When several categories are expanded at once, the card grows tall and there's no quick way to close everything back up. Add a "Collapse all" control that appears once the tree is tall enough to warrant it, positioned in the page's side whitespace on desktop and inline on narrow viewports.

## Components

### `src/components/magicui/file-tree.tsx`
`Tree` currently owns `expandedItems` as uncontrolled internal state (`useState<string[]>`), with no way for a parent to read or reset it. It's the only tree in the codebase (`skills.tsx` is the sole consumer), so extend `TreeViewProps` with optional controlled props:

```ts
expandedItems?: string[];
onExpandedItemsChange?: (items: string[]) => void;
```

When both are provided, `Tree` uses the passed-in `expandedItems` value and calls `onExpandedItemsChange` from `handleExpand` instead of its own setter. When omitted, behavior is unchanged (internal state, as today) — existing `initialExpandedItems`-only usage keeps working.

### `src/components/skills.tsx`
Becomes a client component (`"use client"`) to support the new state/measurement logic.

**State.** Lift `expandedItems` out of `Tree` into `Skills`: `useState<string[]>([skillCategories[0].label])`, passed to `Tree` as the new controlled props. A `collapseAll` handler calls `setExpandedItems([])`.

**Height measurement.** A `ref` on the card div (the `rounded-[20px] border ...` wrapper around `Tree`) feeds a `ResizeObserver` that tracks the card's rendered height in state. `isTall = height > 400`.

**Visibility conditions** (independent of each other):
- Desktop button: `isTall` (card height > 400px).
- Mobile button: `expandedItems.length > 0` (any category open), regardless of height.

**Layout / breakpoint.** The card sits in `Section`'s `Wrap` (`w-[min(100%-40px,1040px)]`) capped at `max-w-[560px]` and centered, leaving up to 240px of gutter on each side at full width — but that gutter shrinks fast below ~960px viewport width, too tight for a floating button plus safe margin. Use a 960px cutoff (Tailwind arbitrary variant, matching the existing `max-[700px]:` pattern already used in `section.tsx`) rather than reusing that 700px value:

- `min-[960px]:` — desktop button. Rendered as a sibling inside the card wrapper (which becomes `relative`), positioned `absolute right-full` (fully outside the card, to its left) with a small margin gap, vertically centered on the card via `top-1/2 -translate-y-1/2`. Shown only when `isTall`. Hidden by default (`hidden min-[960px]:block` gated additionally on `isTall` via conditional render).
- `max-[960px]:` — mobile button. Rendered inline below the `Tree`, inside the card, in normal flow. Shown only when `expandedItems.length > 0`.

Because the desktop button is `absolute` within the card (not `fixed` to the viewport), it scrolls naturally with the page and only appears while the card itself is on screen — no separate viewport-visibility check needed.

**Styling.** A small pill button matching the card's own quiet aesthetic rather than the site's bold CTA (`button.tsx`): `rounded-full border border-line bg-white/56 px-3 py-2 text-[.72rem] font-[850] tracking-[.1em] text-muted uppercase`, `hover:text-ink hover:border-ink`. Label: "Collapse all".

## Out of scope
- Persisting collapsed/expanded state across page loads
- Collapse-all affecting anything other than the Skills tree
- Changing `Tree`'s uncontrolled-mode default behavior for future consumers
- New npm dependencies (`ResizeObserver` is a native browser API)

## Testing / verification
- `npm run dev`: expand enough categories to push the card past ~400px tall — desktop button appears in the left gutter, vertically centered on the card; clicking it collapses everything and the button disappears.
- Resize below 960px: desktop button is hidden; expanding any category shows the inline bottom button instead; clicking it collapses everything.
- `npm run build` succeeds with no type or lint errors.
