import { DiscordIcon, EmailIcon, GitHubIcon, LinkedInIcon } from "./icons";
import { EMAIL } from "@/lib/content";

/**
 * The one list of social/profile links, rendered by both the footer and the
 * mobile menu. Each carries its own PostHog event name, so a click still reads
 * the same in analytics no matter which surface it came from.
 */
export const socialLinks = [
  { label: EMAIL, href: `mailto:${EMAIL}`, Icon: EmailIcon, event: "email_clicked", external: false },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hoperogan/",
    Icon: LinkedInIcon,
    event: "linkedin_clicked",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/roganhope",
    Icon: GitHubIcon,
    event: "github_clicked",
    external: true,
  },
  {
    label: "Discord",
    href: "https://discord.gg/prK7bXqrWQ",
    Icon: DiscordIcon,
    event: "discord_clicked",
    external: true,
  },
] as const;

/** Links out get a trailing arrow; a mailto stays bare. */
export function socialLabel(link: { label: string; external: boolean }) {
  return link.external ? `${link.label} ↗` : link.label;
}
