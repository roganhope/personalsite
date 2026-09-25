"use client";

import Link from "next/link";
import posthog from "posthog-js";
import MobileMenu from "./mobile-menu";
import Wrap from "./wrap";

export default function SiteHeader() {
  // z-20 sits above <main>'s z-10: the mobile menu's overlay renders inside this
  // header, and at equal z-index the hero would paint straight over it.
  return (
    <header className="relative z-20">
      <Wrap>
        <nav className="flex items-center justify-between border-b border-line py-6.5">
          <Link
            href="/#top"
            onClick={() => posthog.capture("nav_link_clicked", { link: "home" })}
            /* z-10 keeps the wordmark above the mobile menu's full-screen overlay. */
            className="relative z-10 text-[.9rem] font-extrabold tracking-[.07em] hover:text-pink"
          >
            H.E.R.
          </Link>
          {/* Below 700px these give way to the hamburger, which carries the same
              links plus the footer's social links. */}
          <div className="flex gap-5.5 text-[.82rem] font-bold tracking-[.08em] uppercase max-[700px]:hidden">
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
          <MobileMenu />
        </nav>
      </Wrap>
    </header>
  );
}
