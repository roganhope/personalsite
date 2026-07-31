export type Project = {
  /** Eyebrow label, e.g. "01 / Product". */
  label: string;
  title: string;
  copy: string;
  href: string;
  image: string;
  /** Screenshots are cropped by default; logos read better contained. */
  fit?: "cover" | "contain";
};

export type Bullet = {
  /** Bold lead-in phrase at the start of the bullet, if any. */
  lead?: string;
  text: string;
};

export type Role = {
  title: string;
  company: string;
  focus: string;
  years: string;
  bullets: Bullet[];
  funFact: string;
  /** Turns a substring of funFact into a link, if present. */
  funFactLink?: { text: string; href: string };
};

export type SkillGroup = {
  label: string;
  skills: string[];
};

export type SkillCategory = {
  label: string;
  skills: string[];
  groups?: SkillGroup[];
};

export const projects: Project[] = [
  {
    label: "01 / Product",
    title: "Sehr Eats",
    copy: "My personal Armenian food blog for sharing and preserving Armenian and Mediterranean culture.",
    href: "https://sehreats.com/",
    image: "/sehr-eats.png",
  },
  {
    label: "02 / Commerce",
    title: "Bikers Outfitter",
    copy: "A high-energy commerce experience for riders, motorcycles, scooters, and parts.",
    href: "https://bikersoutfitter.com/",
    image: "/bikers-outfitter.png",
  },
  {
    label: "03 / Platform",
    title: "Jade",
    copy: "An automation-supported options platform built for independent financial advisors.",
    href: "https://thejadeplatform.com/",
    image: "/jade-platform.png",
  },
  {
    label: "04 / Open source",
    title: "Maiscribe",
    copy: "An open-source project for making transcription feel more effortless.",
    href: "https://github.com/roganhope/maiscribe",
    image: "/maiscribe.png",
    fit: "contain",
  },
];

export const roles: Role[] = [
  {
    title: "Project Manager & Software Engineer",
    company: "The Jade Platform",
    focus: "",
    years: "2025 - 2026",
    bullets: [
      {
        lead: "Led a team of 8 to design and build a B2B SaaS options trading and analytics platform",
        text: " for Registered Investment Advisors, shipping the core product and its agentic AI feature to customers in 10 months to scale to enterprise level. Drove strategy, architecture, tooling, data-provider, and hiring decisions directly with founders and senior leadership, sequencing 20 releases on a biweekly cadence across 4 funding rounds.",
      },
      {
        lead: "Owned the product roadmap for the core platform",
        text: ", ran development retros, and managed scope and delivery in Jira against a constantly shifting product strategy, shipping features on a frequent cadence alongside REST API design. Integrated PostHog analytics and usage campaigns to maintain visibility into how customers used the platform and to iterate on features from real usage. Designed and engineered CI/CD pipelines and cloud infrastructure for staging and production with secure secrets handling, supporting evals, observability, and safe deployment.",
      },
      {
        lead: "Built the platform's core AI agent feature in one month on Spring AI",
        text: " – an autonomous agent system for financial workflows with 8+ tool sets, invoking custom LLMs through AWS Bedrock with secure SSO-authenticated access. Weighed tradeoffs across various AI systems (LangChain, LangGraph, Llama, and Google ADK) before electing Spring AI for speed to production, with scale and migration in mind in agent design. Prioritized observability, production reliability, and financial and legal compliance; designed the system architecture to scale and engineered a custom admin panel with model invocation tracing for versioning, debugging, and building out test cases.",
      },
      {
        lead: "Built and shipped an MCP server as a Claude Code Plugin",
        text: " encoding domain expertise for the external data integration, delivering it to the team to standardize how they scoped, planned, and interacted with sandbox data, improving delivery speed and product quality by 80%. Drove team-wide adoption of agentic development, building internal developer tools including a centralized skill-sharing repo and automation that kept practices consistent across client and backend services.",
      },
    ],
    funFact:
      "I didn't know about options trading before starting this role. By the time of my second interview, I learned enough to get the role, and continued to become an expert in trading strategies to contribute professionally to the platform.",
  },
  {
    title: "Full Stack Web Development & Design Teaching Assistant",
    company: "Tufts University",
    focus: "",
    years: "2023 - 2024",
    bullets: [
      {
        lead: "Provided technical guidance to students on web development concepts",
        text: ", including HTML, CSS, JavaScript, JSON, MongoDB, Node.js, PHP, SQL, NoSQL, API integration, and responsive design.",
      },
      {
        lead: "Led office hours and facilitated discussions",
        text: " on an online board, clarifying concepts and troubleshooting coding issues to support student success including topics from database connections, UI improvement and framework support.",
      },
      {
        lead: "Operated in a fully remote environment",
        text: ", showcasing strong self-management, communication, and collaboration skills to drive project success through tools such as Slack, Zoom and Piazza.",
      },
    ],
    funFact:
      "I didn't apply for this role, the instructor personally reached out and offered me the position after I excelled in the course. Thank you to Lisa Diorio, an outstanding instructor who made the experience even more rewarding.",
  },
  {
    title: "Data Science Intern & Operations Representative",
    company: "EQRx",
    focus: "",
    years: "2021 - 2024",
    bullets: [
      {
        lead: "Promoted to Data Science Intern from operational role.",
        text: " Developed a Mode dashboard in collaboration with the Clinical Data Science team to analyze Small Cell Lung Cancer and gene mutation data, providing insight to support drug development.",
      },
      {
        lead: "Coordinated management of a corporate facility",
        text: " in Cambridge, Massachusetts, oversaw vendors, managing office supplies, administering access control, and supporting overall facility operations.",
      },
      {
        lead: "Served on the planning committee for a successful 300+ person conference",
        text: ", leading event research, contract execution, IT infrastructure coordination, logistics management, and event staff supervision.",
      },
      {
        lead: "Automated access panel control data collection and analysis",
        text: " to track office traffic, enabling data-driven decisions on parking allocation and employee benefits.",
      },
      {
        lead: "Built a geographic analysis tool",
        text: " using the Google Maps API to assess employee commuting distances, helping HR optimize travel compensation policies.",
      },
    ],
    funFact:
      "I taught myself how to code during this time due to my interest in it, using free resources online. This was right before popular AI models became publicly available, and I was coding directly, learning about syntax, data structures and more.",
  },
  {
    title: "Office Manager",
    company: "Bikers Outfitter",
    focus: "",
    years: "2017 - 2021",
    bullets: [
      {
        lead: "Contributed across every facet of a family-owned motorcycle and small engine dealership",
        text: ", supporting technical leadership, sales, operations, administration, inventory management, and dealer relations.",
      },
      {
        lead: "Spearheaded the end-to-end development and launch of the company's e-commerce platform",
        text: ", leading service selection, cost analysis, project planning, site development, contractor management, and inventory onboarding.",
      },
      {
        lead: "Automated inventory management by developing a web scraper",
        text: " to extract product data and images from supplier websites, reducing manual work and improving efficiency.",
      },
      {
        lead: "Successfully migrated the organization's email infrastructure to a new provider",
        text: ", managing domain and DNS transitions while preserving all existing mailboxes and minimizing service downtime.",
      },
    ],
    funFact:
      "I grew up in a Motorcycle Dealership family and would travel across the East Coast for trade shows from the age of eight and worked there throughout high school and college. I learned the value of hard work and grit. For an easter egg, check out the about page on Biker's Outfitters, where you will find me at the age of three sitting on a motorcycle.",
    funFactLink: {
      text: "about page on Biker's Outfitters",
      href: "https://bikersoutfitter.com/pages/about",
    },
  },
];

export const skillCategories: SkillCategory[] = [
  {
    label: "Languages",
    skills: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "HTML5", "CSS3", "jQuery", "PHP", "LaTeX"],
  },
  {
    label: "Frameworks",
    skills: ["Next.js", "Spring Boot", "React", "Node.js", "FastAPI", "Flask", "Django", "Tornado"],
  },
  {
    label: "UI Libraries",
    skills: ["Bootstrap", "MagicUI", "Tailwind", "React"],
  },
  {
    label: "Tools",
    skills: [
      "Git",
      "Visual Studio",
      "Slack",
      "Discord",
      "Teams",
      "G Suite",
      "Miro",
      "LucidChart",
      "Photoshop",
      "Jira",
      "Postman",
    ],
  },
  {
    label: "Platform",
    skills: ["Node.js", "Supabase", "Vercel"],
  },
  {
    label: "Cloud & DevOps",
    skills: ["Docker", "GitHub Actions", "GCP", "Heroku"],
    groups: [
      {
        label: "AWS",
        skills: ["AWS", "Bedrock", "EC2", "IAM", "OIDC", "AWS Secrets", "Lambda", "DynamoDB", "S3"],
      },
    ],
  },
  {
    label: "Databases",
    skills: ["MySQL", "MongoDB", "Postgres", "Redis", "DynamoDB"],
  },
  {
    label: "AI & Agentic",
    skills: [
      "Claude Code",
      "Cursor",
      "Codex",
      "ChatGPT",
      "Google AI SDK",
      "MCP",
      "AI Plugins",
      "AG-UI",
      "Anthropic API",
      "Spring AI",
      "TensorFlow",
      "Keras",
    ],
  },
  {
    label: "Libraries & Data",
    skills: ["pandas", "PostHog", "NumPy", "Matplotlib", "Seaborn", "Pytest"],
  },
];

export const EMAIL = "hope.e.rogan@gmail.com";
