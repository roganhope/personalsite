"use client";

import posthog from "posthog-js";
import { socialLabel, socialLinks } from "./social-links";
import ThemeToggle from "./theme-toggle";
import Wrap from "./wrap";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t-[3px] border-pink bg-footer py-7.5 text-footer-ink">
      {/* Stacks at 820px rather than 700px: the email makes a fourth link, and the
          single row gets too tight to hold together much below that. */}
      <Wrap className="flex items-center justify-between gap-4.5 text-[.8rem] max-[820px]:flex-col">
        <p className="whitespace-nowrap">&copy; {new Date().getFullYear()} Hope Rogan</p>
        <ThemeToggle />
        <div className="flex flex-wrap justify-center gap-x-4.5 gap-y-2 font-bold">
          {socialLinks.map(({ Icon, ...link }) => (
            <a
              key={link.event}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
              onClick={() => posthog.capture(link.event)}
              className="inline-flex items-center gap-1.75 hover:text-pink"
            >
              <Icon />
              {socialLabel(link)}
            </a>
          ))}
        </div>
      </Wrap>
    </footer>
  );
}
