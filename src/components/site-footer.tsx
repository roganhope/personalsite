"use client";

import posthog from "posthog-js";
import { DiscordIcon, EmailIcon, GitHubIcon, LinkedInIcon } from "./icons";
import ThemeToggle from "./theme-toggle";
import Wrap from "./wrap";
import { EMAIL } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t-[3px] border-pink bg-footer py-7.5 text-footer-ink">
      {/* Stacks at 820px rather than 700px: the email makes a fourth link, and the
          single row gets too tight to hold together much below that. */}
      <Wrap className="flex items-center justify-between gap-4.5 text-[.8rem] max-[820px]:flex-col">
        <p className="whitespace-nowrap">&copy; {new Date().getFullYear()} Hope Rogan</p>
        <ThemeToggle />
        <div className="flex flex-wrap justify-center gap-x-4.5 gap-y-2 font-bold">
          <a
            href={`mailto:${EMAIL}`}
            onClick={() => posthog.capture("email_clicked")}
            className="inline-flex items-center gap-1.75 hover:text-pink"
          >
            <EmailIcon />
            {EMAIL}
          </a>
          <a
            href="https://www.linkedin.com/in/hoperogan/"
            target="_blank"
            rel="noreferrer"
            onClick={() => posthog.capture("linkedin_clicked")}
            className="inline-flex items-center gap-1.75 hover:text-pink"
          >
            <LinkedInIcon />
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/roganhope"
            target="_blank"
            rel="noreferrer"
            onClick={() => posthog.capture("github_clicked")}
            className="inline-flex items-center gap-1.75 hover:text-pink"
          >
            <GitHubIcon />
            GitHub ↗
          </a>
          <a
            href="https://discord.gg/prK7bXqrWQ"
            target="_blank"
            rel="noreferrer"
            onClick={() => posthog.capture("discord_clicked")}
            className="inline-flex items-center gap-1.75 hover:text-pink"
          >
            <DiscordIcon />
            Discord ↗
          </a>
        </div>
      </Wrap>
    </footer>
  );
}
