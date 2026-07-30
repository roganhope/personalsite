# Experience Accordion Content + Fun Facts Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Details coming soon" placeholder in the Experience accordion with real bullet content for all four roles (Jade, Web Dev TA, Data Science Intern, Bikers Outfitter) and add a per-role "Fun Fact" callout (pink label, italic text).

**Architecture:** Extend the `Role` type in `src/lib/content.ts` with `bullets: string[]` and `funFact: string`, populate all four role entries (including a new Bikers Outfitter entry), then update the expanded-panel markup in `src/components/experience-list.tsx` to render the bullets as a list and the fun fact as a styled line below it.

**Tech Stack:** Next.js (React 19), Tailwind CSS v4 — no new dependencies.

## Global Constraints

- No new npm dependencies.
- Bikers Outfitter is a new 4th role: `title: "Office Manager"`, `company: "Bikers Outfitter"`, `years: ""`, placed last in the `roles` array.
- The other three roles' existing `title`/`company`/`years`/`focus` values are unchanged.
- Bullet text is plain strings — no markdown/bold parsing. The two Bikers Outfitter bullets that had bold lead-ins in source notes are flattened to plain text.
- Fun Fact module: label text exactly `"Fun Fact: "` styled `font-bold text-pink`, fact text styled `italic text-muted`.
- No automated test suite exists in this repo (no jest/vitest/playwright in `package.json`); verification is `npm run lint`, `npm run build`, and manual checks via `npm run dev` in a browser.

---

### Task 1: Add bullets/funFact content to `roles`

**Files:**
- Modify: `src/lib/content.ts`

**Interfaces:**
- Produces: `Role` type gains `bullets: string[]` and `funFact: string`. `roles` array has 4 entries in order: Jade, Web Dev TA, Data Science Intern, Bikers Outfitter — each with populated `bullets` and `funFact`. Task 2 consumes `role.bullets` and `role.funFact` in `experience-list.tsx`.

- [ ] **Step 1: Extend the `Role` type**

In `src/lib/content.ts`, find:

```ts
export type Role = {
  title: string;
  company: string;
  focus: string;
  years: string;
};
```

Replace with:

```ts
export type Role = {
  title: string;
  company: string;
  focus: string;
  years: string;
  bullets: string[];
  funFact: string;
};
```

- [ ] **Step 2: Populate `roles` with bullets, fun facts, and the new Bikers Outfitter entry**

Find:

```ts
export const roles: Role[] = [
  {
    title: "Product Manager & Lead Software Engineer",
    company: "The Jade Platform",
    focus: "",
    years: "2025 - Now",
  },
  {
    title: "Full Stack Web Design Teaching Assistant",
    company: "Tufts University",
    focus: "",
    years: "2023 - 2024",
  },
  {
    title: "Data Science Intern & Business Professional",
    company: "EQRx",
    focus: "",
    years: "2021 - 2024",
  },
];
```

Replace with:

```ts
export const roles: Role[] = [
  {
    title: "Product Manager & Lead Software Engineer",
    company: "The Jade Platform",
    focus: "",
    years: "2025 - Now",
    bullets: [
      "Led a team of 8 to design and build a B2B SaaS options trading and analytics platform for Registered Investment Advisors, shipping the core product and its agentic AI feature to customers in 10 months to scale to enterprise level. Drove strategy, architecture, tooling, data-provider, and hiring decisions directly with founders and senior leadership, sequencing 20 releases on a biweekly cadence across 4 funding rounds.",
      "Owned the product roadmap for the core platform, ran development retros, and managed scope and delivery in Jira against a constantly shifting product strategy, shipping features on a frequent cadence alongside REST API design. Integrated PostHog analytics and usage campaigns to maintain visibility into how customers used the platform and to iterate on features from real usage. Designed and engineered CI/CD pipelines and cloud infrastructure for staging and production with secure secrets handling, supporting evals, observability, and safe deployment.",
      "Built the platform's core AI agent feature in one month on Spring AI – an autonomous agent system for financial workflows with 8+ tool sets, invoking custom LLMs through AWS Bedrock with secure SSO-authenticated access. Weighed tradeoffs across various AI systems (LangChain, LangGraph, Llama, and Google ADK) before electing Spring AI for speed to production, with scale and migration in mind in agent design. Prioritized observability, production reliability, and financial and legal compliance; designed the system architecture to scale and engineered a custom admin panel with model invocation tracing for versioning, debugging, and building out test cases.",
      "Built and shipped an MCP server as a Claude Code plugin encoding domain expertise for the external data integration, delivering it to the team to standardize how they scoped, planned, and interacted with sandbox data, improving delivery speed and product quality by 80%. Drove team-wide adoption of agentic development, building internal developer tools including a centralized skill-sharing repo and automation that kept practices consistent across client and backend services.",
    ],
    funFact:
      "I didn't know about options trading before starting this role. By the time of my second interview, I learned enough to get the role, and continued to become an expert in trading strategies to contribute professionally to the platform.",
  },
  {
    title: "Full Stack Web Design Teaching Assistant",
    company: "Tufts University",
    focus: "",
    years: "2023 - 2024",
    bullets: [
      "Provided technical guidance to students on web development topics, including HTML, CSS, JavaScript, JSON, MongoDB, Node.js, PHP, SQL, NoSQL, API integration, and responsive design.",
      "Led office hours and facilitated discussions on an online board, clarifying concepts and troubleshooting coding issues to support student success including topics from database connections, UI improvement and framework support.",
      "Operated in a fully remote environment, showcasing strong self-management, communication, and collaboration skills to drive project success through tools such as Slack, Zoom and Piazza.",
    ],
    funFact:
      "I didn't apply for this role—the instructor personally reached out and offered me the position after I excelled in the course. Shoutout to Lisa Diorio, an outstanding instructor who made the experience even more rewarding.",
  },
  {
    title: "Data Science Intern & Business Professional",
    company: "EQRx",
    focus: "",
    years: "2021 - 2024",
    bullets: [
      "Promoted to Data Science Intern from operational role. Developed a Mode dashboard in collaboration with the Clinical Data Science team to analyze Small Cell Lung Cancer and gene mutation data, providing insight to support drug development.",
      "Coordinated management of a corporate facility in Cambridge, Massachusetts, oversaw vendors, managing office supplies, administering access control, and supporting overall facility operations.",
      "Served on the planning committee for a successful 300+ person conference, leading event research, contract execution, IT infrastructure coordination, logistics management, and event staff supervision.",
      "Automated access panel control data collection and analysis to track office traffic, enabling data-driven decisions on parking allocation and employee benefits.",
      "Built a geographic analysis tool using the Google Maps API to assess employee commuting distances, helping HR optimize travel compensation policies.",
    ],
    funFact:
      "I taught myself how to code during this time due to my interest in it. This was right before AI models became publicly available, and I was coding organically, as one would say.",
  },
  {
    title: "Office Manager",
    company: "Bikers Outfitter",
    focus: "",
    years: "",
    bullets: [
      "Contributed across every facet of a family-owned motorcycle and small engine dealership, supporting technical leadership, sales, operations, administration, inventory management, and dealer relations.",
      "Spearheaded the end-to-end development and launch of the company's e-commerce platform, leading service selection, cost analysis, project planning, site development, contractor management, and inventory onboarding.",
      "Automated inventory management by developing a web scraper to extract product data and images from supplier websites, reducing manual work and improving efficiency.",
      "Successfully migrated the organization's email infrastructure to a new provider, managing domain and DNS transitions while preserving all existing mailboxes and minimizing service downtime.",
    ],
    funFact:
      "I grew up in a Motorcycle Dealership family and would travel across the East Coast for shows from the age of 8, and learned the value of hard work and grit. For an easter egg, check out the about page on Bikers Outfitters, where you will find me at the age of 3 sitting on a motorcycle.",
  },
];
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed. The build will currently show unused-data warnings are not expected — `roles` is already consumed by `ExperienceList`, and `bullets`/`funFact` are new fields that TypeScript will accept even before Task 2 reads them (structural typing, no `noUnusedLocals` issue since these are object properties, not variables).

- [ ] **Step 4: Commit**

```bash
git add src/lib/content.ts
git commit -m "Add experience bullets and fun facts to roles content"
```

---

### Task 2: Render bullets and Fun Fact module in the accordion

**Files:**
- Modify: `src/components/experience-list.tsx`

**Interfaces:**
- Consumes: `role.bullets: string[]` and `role.funFact: string` from Task 1.

- [ ] **Step 1: Replace the placeholder paragraph with the bullet list and Fun Fact module**

In `src/components/experience-list.tsx`, find:

```tsx
              <div
                className={`grid min-h-0 overflow-hidden px-6 transition-[padding_.38s_cubic-bezier(.22,1,.36,1),opacity_.2s_ease,transform_.32s_ease] ${
                  isOpen
                    ? "translate-y-0 pt-[22px] pb-[25px] opacity-100"
                    : "-translate-y-2 pt-0 pb-0 opacity-0"
                }`}
              >
                <p className="m-0 text-[.76rem] font-[750] text-muted uppercase">Details coming soon</p>
              </div>
```

Replace with:

```tsx
              <div
                className={`grid min-h-0 overflow-hidden px-6 transition-[padding_.38s_cubic-bezier(.22,1,.36,1),opacity_.2s_ease,transform_.32s_ease] ${
                  isOpen
                    ? "translate-y-0 pt-[22px] pb-[25px] opacity-100"
                    : "-translate-y-2 pt-0 pb-0 opacity-0"
                }`}
              >
                <ul className="m-0 list-disc space-y-2 pl-5 text-[.92rem] text-muted marker:text-pink">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <p className="mt-4 text-[.92rem]">
                  <span className="font-bold text-pink">Fun Fact: </span>
                  <em className="text-muted italic">{role.funFact}</em>
                </p>
              </div>
```

- [ ] **Step 2: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 3: Manual check — all four roles render correctly**

Run: `npm run dev`, open the site, scroll to the Experience section ("The résumé version").
Expected:
- Four role cards: Jade (open by default), Web Dev TA, Data Science Intern, Office Manager / Bikers Outfitter (last).
- Expanding each card shows its bullet list (pink disc markers) followed by a `Fun Fact:` line — "Fun Fact:" in pink bold, the fact text in italic muted gray.
- Bikers Outfitter's header row shows no years (blank), matching the design decision to leave it out.
- Collapsing/expanding animation still works smoothly with the longer content (no layout jump/clipping).

- [ ] **Step 4: Commit**

```bash
git add src/components/experience-list.tsx
git commit -m "Render experience bullets and fun facts in accordion"
```
