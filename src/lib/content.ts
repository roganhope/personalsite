export type Skill = {
  /** Single-letter badge shown in the pill. */
  initial: string;
  name: string;
};

export type SkillGroup = {
  category: string;
  skills: Skill[];
};

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

export type Role = {
  title: string;
  company: string;
  focus: string;
  years: string;
  copy: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Front end",
    skills: [
      { initial: "R", name: "React" },
      { initial: "T", name: "TypeScript" },
      { initial: "N", name: "Next.js" },
      { initial: "C", name: "CSS" },
    ],
  },
  {
    category: "Back end",
    skills: [
      { initial: "N", name: "Node.js" },
      { initial: "P", name: "Python" },
      { initial: "P", name: "Postgres" },
      { initial: "A", name: "APIs" },
    ],
  },
  {
    category: "Also into",
    skills: [
      { initial: "F", name: "Figma" },
      { initial: "G", name: "Git" },
      { initial: "A", name: "Accessibility" },
      { initial: "W", name: "Web perf" },
    ],
  },
];

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
    title: "Biker's Outfitter",
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

// TODO: placeholder work history — companies, dates, and descriptions are invented.
export const roles: Role[] = [
  {
    title: "Senior Front-end Developer",
    company: "Northstar Studio",
    focus: "Product systems & web platforms",
    years: "2022 - now",
    copy: "Partnered with design and product to build a flexible interface system and ship a much-loved client platform.",
    skills: [
      { initial: "R", name: "React" },
      { initial: "T", name: "TypeScript" },
      { initial: "A", name: "Accessibility" },
    ],
  },
  {
    title: "Product Engineer",
    company: "Kindred Labs",
    focus: "Useful tools for busy teams",
    years: "2019 - 2022",
    copy: "Designed and built end-to-end features for a small collaborative product, from rough sketch through release.",
    skills: [
      { initial: "N", name: "Next.js" },
      { initial: "P", name: "Postgres" },
      { initial: "F", name: "Figma" },
    ],
  },
  {
    title: "Developer",
    company: "Field Notes Co.",
    focus: "Expressive sites for good people",
    years: "2017 - 2019",
    copy: "Built fast, characterful websites for people making culture, products, and other good things.",
    skills: [
      { initial: "C", name: "CSS" },
      { initial: "W", name: "Web perf" },
      { initial: "G", name: "Git" },
    ],
  },
];

export const EMAIL = "hope.e.rogan@gmail.com";
