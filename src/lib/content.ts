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

export const EMAIL = "hope.e.rogan@gmail.com";
