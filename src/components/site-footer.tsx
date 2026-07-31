"use client";

import posthog from "posthog-js";
import { DiscordIcon, GitHubIcon, LinkedInIcon } from "./icons";
import Wrap from "./wrap";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t-[3px] border-pink bg-ink py-7.5 text-white">
      <Wrap className="flex items-center justify-between gap-4.5 text-[.8rem] max-[700px]:flex-col">
        <p>&copy; {new Date().getFullYear()} Hope Rogan</p>
        <div className="flex gap-4.5 font-bold">
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
