# Experience Accordion Content + Fun Facts Module

## Problem

The Experience accordion (`ExperienceList`) currently renders a static "Details coming soon" placeholder in every expanded panel. Real bullet content exists for four roles (Jade, Web Dev TA, Data Science Intern, Bikers Outfitter) and needs to be added, along with a "Fun Fact" callout per role.

## Decisions

- Bikers Outfitter is added as a 4th role card (it isn't in `roles` today — it only appears in the separate Projects section). Placed last (oldest/family-business role). Title: "Office Manager". Company: "Bikers Outfitter". Years: left blank (none given).
- The other three roles (Jade, Web Dev TA, Data Science Intern) keep their existing `title`/`company`/`years` metadata unchanged — only bullets and a fun fact are added.
- Two Bikers Outfitter bullets had bold lead-in phrases ("**Contributed across**…", "**Spearheaded**…") in the source notes; these are flattened to plain text so every bullet across every role renders identically.
- "Fun Fact" is a per-role single-line module rendered below the bullet list: label styled `text-pink font-bold`, fact text styled `italic text-muted`.

## Data Shape (`src/lib/content.ts`)

Extend `Role`:

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

`roles` becomes 4 entries, in this order: Jade, Web Dev TA, Data Science Intern, Bikers Outfitter.

### Jade (`title: "Product Manager & Lead Software Engineer"`, `company: "The Jade Platform"`, `years: "2025 - Now"`)

Bullets:
1. Led a team of 8 to design and build a B2B SaaS options trading and analytics platform for Registered Investment Advisors, shipping the core product and its agentic AI feature to customers in 10 months to scale to enterprise level. Drove strategy, architecture, tooling, data-provider, and hiring decisions directly with founders and senior leadership, sequencing 20 releases on a biweekly cadence across 4 funding rounds.
2. Owned the product roadmap for the core platform, ran development retros, and managed scope and delivery in Jira against a constantly shifting product strategy, shipping features on a frequent cadence alongside REST API design. Integrated PostHog analytics and usage campaigns to maintain visibility into how customers used the platform and to iterate on features from real usage. Designed and engineered CI/CD pipelines and cloud infrastructure for staging and production with secure secrets handling, supporting evals, observability, and safe deployment.
3. Built the platform's core AI agent feature in one month on Spring AI – an autonomous agent system for financial workflows with 8+ tool sets, invoking custom LLMs through AWS Bedrock with secure SSO-authenticated access. Weighed tradeoffs across various AI systems (LangChain, LangGraph, Llama, and Google ADK) before electing Spring AI for speed to production, with scale and migration in mind in agent design. Prioritized observability, production reliability, and financial and legal compliance; designed the system architecture to scale and engineered a custom admin panel with model invocation tracing for versioning, debugging, and building out test cases.
4. Built and shipped an MCP server as a Claude Code plugin encoding domain expertise for the external data integration, delivering it to the team to standardize how they scoped, planned, and interacted with sandbox data, improving delivery speed and product quality by 80%. Drove team-wide adoption of agentic development, building internal developer tools including a centralized skill-sharing repo and automation that kept practices consistent across client and backend services.

Fun fact: I didn't know about options trading before starting this role. By the time of my second interview, I learned enough to get the role, and continued to become an expert in trading strategies to contribute professionally to the platform.

### Web Dev TA (`title: "Full Stack Web Design Teaching Assistant"`, `company: "Tufts University"`, `years: "2023 - 2024"`)

Bullets:
1. Provided technical guidance to students on web development topics, including HTML, CSS, JavaScript, JSON, MongoDB, Node.js, PHP, SQL, NoSQL, API integration, and responsive design.
2. Led office hours and facilitated discussions on an online board, clarifying concepts and troubleshooting coding issues to support student success including topics from database connections, UI improvement and framework support.
3. Operated in a fully remote environment, showcasing strong self-management, communication, and collaboration skills to drive project success through tools such as Slack, Zoom and Piazza.

Fun fact: I didn't apply for this role—the instructor personally reached out and offered me the position after I excelled in the course. Shoutout to Lisa Diorio, an outstanding instructor who made the experience even more rewarding.

### Data Science Intern (`title: "Data Science Intern & Business Professional"`, `company: "EQRx"`, `years: "2021 - 2024"`)

Bullets:
1. Promoted to Data Science Intern from operational role. Developed a Mode dashboard in collaboration with the Clinical Data Science team to analyze Small Cell Lung Cancer and gene mutation data, providing insight to support drug development.
2. Coordinated management of a corporate facility in Cambridge, Massachusetts, oversaw vendors, managing office supplies, administering access control, and supporting overall facility operations.
3. Served on the planning committee for a successful 300+ person conference, leading event research, contract execution, IT infrastructure coordination, logistics management, and event staff supervision.
4. Automated access panel control data collection and analysis to track office traffic, enabling data-driven decisions on parking allocation and employee benefits.
5. Built a geographic analysis tool using the Google Maps API to assess employee commuting distances, helping HR optimize travel compensation policies.

Fun fact: I taught myself how to code during this time due to my interest in it. This was right before AI models became publicly available, and I was coding organically, as one would say.

### Bikers Outfitter (`title: "Office Manager"`, `company: "Bikers Outfitter"`, `years: ""`) — new entry

Bullets (bold stripped):
1. Contributed across every facet of a family-owned motorcycle and small engine dealership, supporting technical leadership, sales, operations, administration, inventory management, and dealer relations.
2. Spearheaded the end-to-end development and launch of the company's e-commerce platform, leading service selection, cost analysis, project planning, site development, contractor management, and inventory onboarding.
3. Automated inventory management by developing a web scraper to extract product data and images from supplier websites, reducing manual work and improving efficiency.
4. Successfully migrated the organization's email infrastructure to a new provider, managing domain and DNS transitions while preserving all existing mailboxes and minimizing service downtime.

Fun fact: I grew up in a Motorcycle Dealership family and would travel across the East Coast for shows from the age of 8, and learned the value of hard work and grit. For an easter egg, check out the about page on Bikers Outfitters, where you will find me at the age of 3 sitting on a motorcycle.

## Rendering (`src/components/experience-list.tsx`)

Inside the existing expanded-panel `<div>` (currently holding the "Details coming soon" placeholder `<p>`), replace the placeholder with:

1. A bullet list:
   ```tsx
   <ul className="m-0 list-disc space-y-2 pl-5 text-[.92rem] text-muted marker:text-pink">
     {role.bullets.map((bullet) => (
       <li key={bullet}>{bullet}</li>
     ))}
   </ul>
   ```
2. Below the list, the Fun Fact module:
   ```tsx
   <p className="mt-4 text-[.92rem]">
     <span className="font-bold text-pink">Fun Fact: </span>
     <em className="text-muted italic">{role.funFact}</em>
   </p>
   ```

No other structural changes to `experience-list.tsx` — the accordion open/close behavior, header row (title/company/focus/years), and animation classes stay as-is. `experience.tsx`, `Section`, and `Wrap` are untouched.

## Out of Scope

- No changes to the Projects section (Bikers Outfitter's existing project card there is unaffected).
- No date/title updates to the existing three roles' header metadata.
- No markdown parsing for bullets — content is stored as plain strings in `content.ts`.
