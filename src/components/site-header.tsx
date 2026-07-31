"use client";

import Link from "next/link";
import posthog from "posthog-js";
import Wrap from "./wrap";

export default function SiteHeader() {
  return (
    <header className="relative z-10">
      <Wrap>
        <nav className="flex items-center justify-between border-b border-line py-6.5">
          <Link
            href="/#top"
            onClick={() => posthog.capture("nav_link_clicked", { link: "home" })}
            className="text-[.9rem] font-extrabold tracking-[.07em] hover:text-pink"
          >
            H.E.R.
          </Link>
          <div className="flex gap-5.5 text-[.82rem] font-bold tracking-[.08em] uppercase max-[700px]:gap-3 max-[700px]:text-[.7rem]">
            <Link
              href="/#portfolio"
              onClick={() => posthog.capture("nav_link_clicked", { link: "portfolio" })}
              className="hover:text-pink"
            >
              Portfolio
            </Link>
            <Link
              href="/#contact"
              onClick={() => posthog.capture("nav_link_clicked", { link: "contact" })}
              className="hover:text-pink"
            >
              Contact
            </Link>
          </div>
        </nav>
      </Wrap>
    </header>
  );
}
