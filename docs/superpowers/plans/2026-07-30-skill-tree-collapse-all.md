# Skill Tree Collapse All Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Collapse all" control to the Skills ("Skill Tree") section that appears once the tree card grows past 400px tall (desktop) or has any category open (mobile), and collapses every open category when clicked.

**Architecture:** Lift `Tree`'s expanded-items state out of the component so `Skills` can own and reset it. `Skills` becomes a client component that measures its card's height with a `ResizeObserver` and renders a desktop-only floating button to the card's left (≥960px viewport) or a mobile-only inline button below the tree (<960px viewport).

**Tech Stack:** Next.js (React 19), Tailwind CSS v4 (arbitrary breakpoint variants, e.g. `max-[700px]:` already used in `section.tsx`), native `ResizeObserver` — no new dependencies.

## Global Constraints

- No new npm dependencies — `ResizeObserver` is a native browser API.
- Height trigger threshold: exactly 400px (card's rendered height).
- Desktop/mobile layout cutoff: exactly 960px viewport width, using Tailwind arbitrary variants (`min-[960px]:`, `max-[960px]:`), not the existing 700px breakpoint used elsewhere in the codebase.
- Button label copy: exactly "Collapse all".
- `Tree`'s existing uncontrolled-mode behavior (used via `initialExpandedItems` with no `expandedItems`/`onExpandedItemsChange` passed) must remain unchanged, since it's a shared component file even though `skills.tsx` is currently its only consumer.
- No automated test suite exists in this repo (no jest/vitest/playwright in `package.json`); verification is `npm run lint`, `npm run build`, and manual checks via `npm run dev` in a browser.

---

### Task 1: Controlled expanded-state support in `Tree`

**Files:**
- Modify: `src/components/magicui/file-tree.tsx`

**Interfaces:**
- Produces: `Tree` accepts two new optional props, `expandedItems?: string[]` and `onExpandedItemsChange?: (items: string[]) => void`. When both are passed, `Tree` is fully controlled: it renders using the passed `expandedItems` and calls `onExpandedItemsChange` on every expand/collapse instead of managing its own state. When omitted, `Tree` behaves exactly as before (internal `useState`, seeded from `initialExpandedItems`).

- [ ] **Step 1: Add the controlled props to `TreeViewProps`**

In `src/components/magicui/file-tree.tsx`, find:

```ts
type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpandedItems?: string[];
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  sort?: TreeSortMode;
} & Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>, "defaultValue" | "onValueChange" | "type" | "value">;
```

Replace with:

```ts
type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpandedItems?: string[];
  expandedItems?: string[];
  onExpandedItemsChange?: (items: string[]) => void;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  sort?: TreeSortMode;
} & Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>, "defaultValue" | "onValueChange" | "type" | "value">;
```

- [ ] **Step 2: Drop the unused `setExpandedItems` field from `TreeContextProps`**

It's declared and put into context today but never read by `Folder` or `File` — confirmed via `grep -n "setExpandedItems" src/components/magicui/file-tree.tsx`, which shows only the declaration, the internal `useState` call, and the context value assignment. Find:

```ts
type TreeContextProps = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  indicator: boolean;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
};
```

Replace with:

```ts
type TreeContextProps = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  indicator: boolean;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
};
```

- [ ] **Step 3: Make `Tree`'s state controlled/uncontrolled hybrid**

Find the `Tree` implementation:

```ts
const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    { className, elements, initialSelectedId, initialExpandedItems, children, indicator = true, openIcon, closeIcon, sort = "default", ...props },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);
    const [expandedItems, setExpandedItems] = useState<string[] | undefined>(initialExpandedItems);

    const selectItem = useCallback((id: string) => setSelectedId(id), []);

    const handleExpand = useCallback((id: string) => {
      setExpandedItems((prev) => (prev?.includes(id) ? prev.filter((item) => item !== id) : [...(prev ?? []), id]));
    }, []);

    const treeChildren = children ?? (elements ? renderTreeElements(elements, sort) : null);

    return (
      <TreeContext.Provider
        value={{ selectedId, expandedItems, handleExpand, selectItem, setExpandedItems, indicator, openIcon, closeIcon }}
      >
        <div ref={ref} className={cn("relative w-full", className)}>
          <AccordionPrimitive.Root {...props} type="multiple" value={expandedItems} className="flex flex-col gap-1">
            {treeChildren}
          </AccordionPrimitive.Root>
        </div>
      </TreeContext.Provider>
    );
  }
);
```

Replace with:

```ts
const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      expandedItems: controlledExpandedItems,
      onExpandedItemsChange,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      sort = "default",
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);
    const [internalExpandedItems, setInternalExpandedItems] = useState<string[] | undefined>(initialExpandedItems);

    const isControlled = controlledExpandedItems !== undefined;
    const expandedItems = isControlled ? controlledExpandedItems : internalExpandedItems;

    const selectItem = useCallback((id: string) => setSelectedId(id), []);

    const handleExpand = useCallback(
      (id: string) => {
        const next = expandedItems?.includes(id)
          ? (expandedItems ?? []).filter((item) => item !== id)
          : [...(expandedItems ?? []), id];
        if (isControlled) {
          onExpandedItemsChange?.(next);
        } else {
          setInternalExpandedItems(next);
        }
      },
      [expandedItems, isControlled, onExpandedItemsChange]
    );

    const treeChildren = children ?? (elements ? renderTreeElements(elements, sort) : null);

    return (
      <TreeContext.Provider
        value={{ selectedId, expandedItems, handleExpand, selectItem, indicator, openIcon, closeIcon }}
      >
        <div ref={ref} className={cn("relative w-full", className)}>
          <AccordionPrimitive.Root {...props} type="multiple" value={expandedItems} className="flex flex-col gap-1">
            {treeChildren}
          </AccordionPrimitive.Root>
        </div>
      </TreeContext.Provider>
    );
  }
);
```

- [ ] **Step 4: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed with no errors (no other file references `setExpandedItems` from context, so removing it is safe).

- [ ] **Step 5: Manual check — existing behavior unchanged**

Run: `npm run dev`, open the site, scroll to the Skills ("Skill Tree") section.
Expected: tree still expands/collapses categories on click exactly as before — `skills.tsx` doesn't pass the new props yet, so `Tree` stays in uncontrolled mode and nothing visibly changes.

- [ ] **Step 6: Commit**

```bash
git add src/components/magicui/file-tree.tsx
git commit -m "Support controlled expanded-items state in Tree"
```

---

### Task 2: Desktop "Collapse all" button

**Files:**
- Modify: `src/components/skills.tsx`

**Interfaces:**
- Consumes: `Tree`'s `expandedItems`/`onExpandedItemsChange` controlled props from Task 1.
- Produces: `Skills` owns `expandedItems: string[]` state and a `collapseAll: () => void` handler that Task 3 will also use for the mobile button.

- [ ] **Step 1: Convert `skills.tsx` to a client component with lifted, measured state**

Replace the full contents of `src/components/skills.tsx` with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { File, Folder, Tree } from "./magicui/file-tree";
import Section from "./section";
import Wrap from "./wrap";
import { skillCategories } from "@/lib/content";

/** Filenames in public/skill-icons, keyed by skill label. Omitted skills fall back to the generic file icon. */
const skillIcons: Record<string, string> = {
  Python: "python.svg",
  Java: "java.svg",
  TypeScript: "typescript.svg",
  JavaScript: "javascript.svg",
  "HTML/CSS": "html5.svg",
  jQuery: "jquery.svg",
  PHP: "php.svg",
  LaTeX: "latex.svg",
  "Next.js": "nextjs.svg",
  "Spring Boot": "springboot.svg",
  React: "react.svg",
  "Node.js": "nodejs.svg",
  FastAPI: "fastapi.svg",
  Flask: "flask.svg",
  Django: "django.svg",
  Bootstrap: "bootstrap.svg",
  Tailwind: "tailwindcss.svg",
  Git: "git.svg",
  "Visual Studio": "visualstudio.svg",
  Slack: "slack.svg",
  Discord: "discord.svg",
  Miro: "miro.svg",
  Photoshop: "photoshop.svg",
  Jira: "jira.svg",
  Supabase: "supabase.svg",
  Vercel: "vercel.svg",
  AWS: "amazonwebservices.svg",
  DynamoDB: "dynamodb.svg",
  Docker: "docker.svg",
  "GitHub Actions": "githubactions.svg",
  GCP: "googlecloud.svg",
  Heroku: "heroku.svg",
  MySQL: "mysql.svg",
  MongoDB: "mongodb.svg",
  Postgres: "postgresql.svg",
  Redis: "redis.svg",
  "Claude Code": "claude.svg",
  Cursor: "cursor.svg",
  "Google AI SDK": "googlegemini.svg",
  "Anthropic API": "anthropic.svg",
  "Spring AI": "spring.svg",
  TensorFlow: "tensorflow.svg",
  Keras: "keras.svg",
  pandas: "pandas.svg",
  PostHog: "posthog.svg",
  NumPy: "numpy.svg",
  Matplotlib: "matplotlib.svg",
  Pytest: "pytest.svg",
};

function SkillIcon({ skill }: { skill: string }) {
  const file = skillIcons[skill];
  if (!file) return undefined;
  // eslint-disable-next-line @next/next/no-img-element -- small static logo, next/image doesn't optimize local SVGs
  return <img src={`/skill-icons/${file}`} alt="" className="h-4 w-4 shrink-0 object-contain" />;
}

const TALL_THRESHOLD_PX = 400;

export default function Skills() {
  const [expandedItems, setExpandedItems] = useState<string[]>([skillCategories[0].label]);
  const [isTall, setIsTall] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new ResizeObserver(([entry]) => {
      setIsTall(entry.contentRect.height > TALL_THRESHOLD_PX);
    });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const collapseAll = () => setExpandedItems([]);

  return (
    <Section id="skills">
      <Wrap className="max-w-[560px]">
        <p className="m-0 mb-8 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">
          Skill Tree
        </p>
        <div ref={cardRef} className="relative rounded-[20px] border border-line bg-white/56 p-4 text-left">
          {isTall && (
            <button
              type="button"
              onClick={collapseAll}
              className="absolute top-1/2 right-full mr-4 hidden -translate-y-1/2 rounded-full border border-line bg-white/56 px-3 py-2 text-[.72rem] font-[850] tracking-[.1em] text-muted uppercase transition-colors duration-150 hover:border-ink hover:text-ink min-[960px]:block"
            >
              Collapse all
            </button>
          )}
          <Tree sort="none" expandedItems={expandedItems} onExpandedItemsChange={setExpandedItems}>
            {skillCategories.map((category) => (
              <Folder key={category.label} value={category.label} element={category.label}>
                {category.skills.map((skill) => (
                  <File
                    key={`${category.label}/${skill}`}
                    value={`${category.label}/${skill}`}
                    fileIcon={<SkillIcon skill={skill} />}
                  >
                    <span>{skill}</span>
                  </File>
                ))}
              </Folder>
            ))}
          </Tree>
        </div>
      </Wrap>
    </Section>
  );
}
```

Note: `sort="none"` and the `Tree`'s `children` usage stay exactly as before — only the state and the new button are new. `initialExpandedItems` is dropped since `expandedItems` is now always passed (making `Tree` controlled).

- [ ] **Step 2: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed. (`"use client"` is required because the component now uses `useState`/`useEffect`/`useRef`.)

- [ ] **Step 3: Manual check — desktop button appears, is positioned correctly, and collapses**

Run: `npm run dev`, open the site at a viewport ≥960px wide, scroll to Skill Tree.
Expected:
- With only the first category open, the card is short and no button is visible.
- Click through categories to open several at once until the card exceeds ~400px tall. A "Collapse all" pill button appears in the left gutter, vertically centered against the card (not the viewport).
- Click it: every category collapses, the card shrinks, and the button disappears (since `isTall` becomes false).

- [ ] **Step 4: Commit**

```bash
git add src/components/skills.tsx
git commit -m "Add desktop collapse-all button to Skill Tree"
```

---

### Task 3: Mobile "Collapse all" button

**Files:**
- Modify: `src/components/skills.tsx`

**Interfaces:**
- Consumes: `expandedItems` and `collapseAll` from Task 2's `Skills` component.

- [ ] **Step 1: Add the inline mobile button below the tree**

In `src/components/skills.tsx`, add a derived `anyExpanded` value and the mobile button. Find:

```tsx
  const collapseAll = () => setExpandedItems([]);

  return (
```

Replace with:

```tsx
  const collapseAll = () => setExpandedItems([]);
  const anyExpanded = expandedItems.length > 0;

  return (
```

Then find the closing of the `Tree` element inside the card:

```tsx
          </Tree>
        </div>
      </Wrap>
    </Section>
  );
```

Replace with:

```tsx
          </Tree>
          {anyExpanded && (
            <button
              type="button"
              onClick={collapseAll}
              className="mt-3 hidden w-full rounded-full border border-line bg-white/56 px-3 py-2 text-[.72rem] font-[850] tracking-[.1em] text-muted uppercase transition-colors duration-150 hover:border-ink hover:text-ink max-[960px]:block"
            >
              Collapse all
            </button>
          )}
        </div>
      </Wrap>
    </Section>
  );
```

- [ ] **Step 2: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 3: Manual check — mobile button appears/hides correctly at the 960px cutoff**

Run: `npm run dev`, open dev tools responsive mode.
Expected:
- At <960px viewport width: opening any single category (even a short one) immediately shows the full-width "Collapse all" button below the tree, inside the card. Clicking it collapses everything and the button disappears. The desktop floating button never appears at this width, regardless of height.
- At ≥960px viewport width: the inline bottom button never appears, even with several categories open — only the desktop floating button (Task 2) shows, and only once the card passes 400px tall.
- Resize across the 960px boundary with several categories open: the two button styles hand off cleanly (only one visible at a time).

- [ ] **Step 4: Commit**

```bash
git add src/components/skills.tsx
git commit -m "Add mobile collapse-all button to Skill Tree"
```
