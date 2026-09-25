"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CloseIcon, MenuIcon } from "./icons";
import { socialLabel, socialLinks } from "./social-links";

const navLinks = [
  { label: "Portfolio", href: "/#portfolio", event: "portfolio" },
  { label: "Contact", href: "/#contact", event: "contact" },
];

/** Matches the `min-[700px]`/`max-[700px]` split the header uses to swap layouts. */
const DESKTOP_QUERY = "(min-width: 700px)";

/**
 * The small-screen nav: a hamburger that fills the viewport with the same links
 * as the desktop nav — centered — plus each footer social link as a row of its
 * own along the bottom. The overlay is `fixed inset-0` and lives inside
 * `<header>`, which is why the logo and the toggle carry `relative z-10`: they
 * have to stay above it so the bar still reads as a bar with the menu open.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      // The overlay hides the page but doesn't remove it from the tab order, so
      // keep Tab cycling between the toggle and the menu's own links.
      if (event.key !== "Tab") return;
      const root = rootRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>("a[href], button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const leaving = event.shiftKey ? first : last;
      if (document.activeElement === leaving || !root.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    // Resizing up to the desktop layout would otherwise strand the overlay open
    // over a header that no longer shows a button to close it.
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  return (
    <div ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        className="relative z-10 -mr-1.5 inline-flex items-center justify-center p-1.5 hover:text-pink min-[700px]:hidden"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
            /* pt-21 clears the header bar, whose 84px height the hero also
               assumes in its `min-h-[calc(100vh-84px)]`. */
            className="fixed inset-0 flex flex-col overflow-y-auto bg-paper px-5 pt-21 pb-14 min-[700px]:hidden"
          >
            {/* shrink-0 on both halves: in a short landscape viewport the container
                scrolls rather than squeezing the two groups into each other. */}
            <div className="flex flex-1 shrink-0 flex-col items-center justify-center gap-11 py-8">
              {navLinks.map((link) => (
                <Link
                  key={link.event}
                  href={link.href}
                  onClick={() => {
                    posthog.capture("nav_link_clicked", { link: link.event });
                    setOpen(false);
                  }}
                  className="text-[1.05rem] font-bold tracking-[.1em] uppercase hover:text-pink"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex shrink-0 flex-col items-center gap-4.5">
              {socialLinks.map(({ Icon, ...link }) => (
                <a
                  key={link.event}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  onClick={() => {
                    posthog.capture(link.event);
                    setOpen(false);
                  }}
                  className="inline-flex items-center gap-2.5 text-[.85rem] font-bold hover:text-pink"
                >
                  <Icon />
                  {socialLabel(link)}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
