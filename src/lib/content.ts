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
  /**
   * Sub-role heading this bullet sits under. Consecutive bullets with the same
   * group render as one labelled list; roles with no groups render one plain list.
   */
  group?: string;
  /** Bold lead-in phrase at the start of the bullet, if any. */
  lead?: string;
  text: string;
};

export type Role = {
  title: string;
  company: string;
  /** Italic line beside the company name; leave empty to show nothing. */
  companyDescription: string;
  /** Short paragraph shown above the bullets, when a role needs context first. */
  summary?: string;
  years: string;
  bullets: Bullet[];
  funFact: string;
  /** Turns a substring of funFact into a link, if present. */
  funFactLink?: { text: string; href: string };
  /** Turns a substring of funFact into a button that opens a photo popup. */
  funFactEasterEgg?: { text: string; image: string; alt: string; caption?: string };
};

export type School = {
  school: string;
  location: string;
  degree: string;
  years: string;
  /** Path under public/. */
  logo: string;
  /** Flat-black logo that needs flipping to stay visible on a dark card. */
  monochrome?: boolean;
};

export type Review = {
  name: string;
  /** Their LinkedIn headline (or role, for direct reviews). */
  title: string;
  /** How we worked together — shown with the date under the quote. */
  relationship: string;
  date: string;
  quote: string;
  /** Exact substring of quote rendered bold as the pull-quote. */
  highlight?: string;
  /** Path under public/; an initials circle is shown when absent. */
  photo?: string;
  profileUrl?: string;
  source: "linkedin" | "direct";
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
    copy: "My personal food blog for Armenian and Middle Eastern recipes, preserving culture and family recipes.",
    href: "https://sehreats.com/",
    image: "/sehr-eats.png",
  },
  {
    label: "02 / Commerce",
    title: "Biker's Outfitters",
    copy: "An e-commerce platform I was contracted to build for Biker's Outfitters, a family-owned motorcycle dealership.",
    href: "https://bikersoutfitter.com/",
    image: "/bikers-outfitter.png",
  },
  {
    label: "03 / Platform",
    title: "The Jade Platform",
    copy: "Served as lead engineer at Jade to engineer an options strategy management application for wealth management firms.",
    href: "https://thejadeplatform.com/",
    image: "/jade-platform.png",
  },
  {
    label: "04 / Open Source",
    title: "Maiscribe",
    copy: "Meaning \"My AI Scribe,\" an early-stage open-source project for free and accessible audio file transcription, speaker diarization, and AI summarization.",
    href: "https://github.com/roganhope/maiscribe",
    image: "/maiscribe.png",
    fit: "contain",
  },
  {
    label: "05 / Web App",
    title: "Find a Time",
    copy: "A public group scheduling app. Still in beta release, with more features coming soon.",
    href: "https://findatime.tech/",
    image: "/findatimetech.png",
  },
];

export const education: School[] = [
  {
    school: "Tufts University",
    location: "Medford, MA",
    degree: "Master of Science in Computer Science",
    years: "2023 - 2025",
    logo: "/education/tufts-wordmark.png",
  },
  {
    school: "University of Massachusetts Amherst",
    location: "Amherst, MA",
    degree: "Bachelor of Arts in Economics",
    years: "2017 - 2021",
    logo: "/education/umass-seal.png",
    monochrome: true,
  },
];

export const roles: Role[] = [
  {
    title: "Project Manager & Software Engineer",
    company: "The Jade Platform",
    companyDescription: "Fintech Startup: Options Management for Wealth Management Advisors",
    years: "2025 - Present",
    bullets: [
      {
        lead: "Served as technical and product lead, directing a team of 8",
        text: " to turn an early startup concept into a production-ready B2B fintech platform in 10 months.",
      },
      {
        lead: "Architected and built the platform from scratch",
        text: ", including a Next.js client, Java/Spring Boot REST API, Python compute service, user analytics, and AWS deployment with Docker and secure CI/CD pipelines.",
      },
      {
        lead: "Owned the product roadmap",
        text: ", managing feature timelines, resource allocation, and integration vendor management, sequencing ~20 biweekly releases under tight resources while keeping the product aligned with a constantly evolving strategy across 4 funding rounds.",
      },
      {
        lead: "Led AI strategy across product and engineering",
        text: ", including shipping a production agent that acts on the user's screen with built-in compliance guardrails, and managing team-wide AWS Bedrock access and custom Claude Code plugins for development.",
      },
    ],
    funFact:
      "I didn't know enough about options trading before starting this role. By the time of my second interview, I learned enough to get hired and continued to become an expert in trading strategies to contribute professionally to the platform.",
  },
  {
    title: "Full Stack Web Development & Design Teaching Assistant",
    company: "Tufts University",
    companyDescription: "A 12,000-Student, Private, Nonsectarian, R1 Research University",
    years: "2024 - 2024",
    bullets: [
      {
        lead: "Provided full-stack technical guidance to students",
        text: " in office hours and online across HTML, CSS, JavaScript, JSON, MongoDB, Node.js, PHP, SQL, NoSQL, API integration, and responsive design.",
      },
      {
        lead: "Reviewed, debugged, and graded student code with detailed, constructive feedback",
        text: ", and ran office hours and an online discussion board working through database, framework, and architecture concepts.",
      },
    ],
    funFact:
      "I didn't apply for this role; the instructor personally reached out and offered me the position after I excelled in the course. Thank you to Lisa Diorio, an outstanding instructor who made the experience even more rewarding.",
  },
  {
    title: "Data Science Intern & Operations Representative",
    company: "EQRx",
    companyDescription: "Biotech Startup: Pharmaceuticals",
    years: "2021 - 2023",
    bullets: [
      {
        group: "Operations Representative",
        lead: "Coordinated daily operations for a 400-person, $750M venture-backed biotech startup",
        text: ", managing visitor access, deliveries, space allocation, vendor contracts and ordering, and regularly taking on projects beyond the role's scope.",
      },
      {
        group: "Operations Representative",
        lead: "Led operations on a cross-functional committee planning the company's first 300+ person conference",
        text: ", negotiating vendor contracts within budget, partnering with IT to install fiber-optic internet, and hiring and managing temporary staff, delivering an event that received highly positive attendee feedback.",
      },
      {
        group: "Operations Representative",
        lead: "Built and maintained an automated reporting pipeline using Bash and Python (pandas)",
        text: " that extracted and cleaned badge access data into a monthly attendance report, replacing manual estimates and giving operations reliable data to set ongoing parking and benefits policy.",
      },
      {
        group: "Operations Representative",
        lead: "Proposed and built a Python tool to calculate employee commute distances",
        text: ", sourcing ADP data across teams and integrating the Google Maps API, then deployed it in Mode to give HR a reusable, data-driven basis for travel reimbursement policy.",
      },
      {
        group: "Data Science Intern",
        lead: "Recognized for self-directed technical learning and selected for a concurrent data science internship",
        text: " while maintaining my operations role, partnering with the Clinical Data Science team to build an interactive Mode dashboard analyzing small cell lung cancer and gene mutation patterns to inform drug development.",
      },
      {
        group: "Data Science Intern",
        lead: "Quickly mastered an unfamiliar clinical data domain with minimal assistance",
        text: ", leveraging SQL, Google Cloud Platform (GCP), GitHub, and Mode to analyze complex datasets, develop interactive dashboards, and communicate findings to technical and nontechnical stakeholders.",
      },
    ],
    funFact:
      "I taught myself how to code during this time due to my interest in it, using free resources online. This was right before popular AI models became publicly available, and I was coding directly, learning about syntax, data structures and more.",
  },
  {
    title: "Office Manager & Engineer",
    company: "Biker's Outfitters",
    companyDescription: "Motorcycle Dealership",
    summary:
      "Biker's Outfitters is my family's business, which I grew up in. Over the years I have contributed in many ways, and most recently have been contributing with my skills in computer science.",
    years: "2017 - 2021",
    bullets: [
      {
        lead: "Contributed across every facet of a family-owned motorcycle and small engine dealership",
        text: ", supporting technical leadership, sales, operations, administration, inventory management, and dealer relations.",
      },
      {
        lead: "Spearheaded the end-to-end development and launch of the company's e-commerce platform",
        text: " (bikersoutfitter.com), leading service selection, cost analysis, project planning, site development, contractor management, and inventory onboarding.",
      },
      {
        lead: "Automated inventory management by developing a web scraper",
        text: " to extract product data and images from supplier websites, reducing manual work and improving efficiency.",
      },
      {
        lead: "Migrated the organization's email infrastructure to a new provider",
        text: ", managing domain and DNS transitions while preserving all existing mailboxes and minimizing service downtime.",
      },
    ],
    funFact:
      "I grew up in a Motorcycle Dealership family and would travel across the East Coast for trade shows from the age of eight and worked there throughout high school and college. I learned the value of hard work and grit. Click here for an easter egg.",
    funFactEasterEgg: {
      text: "Click here for an easter egg",
      image: "/bikers-easter-egg.jpg",
      alt: "Hope at age three sitting on a motorcycle outside Biker's Outfitters",
      caption: "That's me! Ask me if I know how to ride a motorcycle.",
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

export const reviews: Review[] = [
  {
    name: "Jeffrey Breen",
    title: "Technology investor; analytics and AI specialist; hands-on data geek at heart",
    relationship: "Senior to Hope at Jade",
    date: "Jul 2026",
    quote:
      "Hope was instrumental in building and launching the Jade Platform, an integrated options platform to help RIAs and other wealth managers turn their clients’ stock portfolios into actively managed sources of income with better risk controls. To focus only on her success herding the proverbial cats around Product would risk underselling her technical contributions. I can’t think of a single part of the platform she wasn’t hands-on with, right down to AWS infrastructure work such as wiring up Claude Code through Bedrock for the whole team to use — and then using it to prototype a chatbot interface. Her technical experience is matched by a disciplined MVP orientation and a relentless commitment to shipping: she is not afraid to cut scope to what customers actually need to get working software into customers’ hands rather than gold-plating in a vacuum.",
    highlight: "Hope was instrumental in building and launching the Jade Platform",
    photo: "/reviews/jeffrey-breen.jpg",
    profileUrl: "https://www.linkedin.com/in/jeffreybreen/",
    source: "linkedin",
  },
  {
    name: "Lee Crawford",
    title: "Creating the future of Insurtech solutions",
    relationship: "Advisor to Jade",
    date: "Jul 2026",
    quote:
      "Hope is the ideal high-impact startup engineer. As an advisor to Jade, I watched her consistently go above and beyond her core product/engineering responsibilities. She was adept at juggling project timelines, refining product requirements, and jumping into lead design efforts. Hope did whatever it took to ensure things were done — and done exceptionally well. Her ambition, versatility, and technical talent make her an invaluable asset to any fast-growing team.",
    highlight: "Hope is the ideal high-impact startup engineer.",
    photo: "/reviews/lee-crawford.jpg",
    profileUrl: "https://www.linkedin.com/in/lecrawford/",
    source: "linkedin",
  },
];

export const EMAIL = "hope.e.rogan@gmail.com";
