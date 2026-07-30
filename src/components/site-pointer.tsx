"use client";

import { useEffect, useRef } from "react";

/**
 * Replaces the system cursor with a pink arrow. Only engages for real cursors
 * on devices where the user hasn't asked for reduced motion — the matching
 * `cursor: none` rule in globals.css is gated on the same conditions.
 */
export default function SitePointer() {
  const pointerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let frame: number;
    const movePointer = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        pointerRef.current?.style.setProperty(
          "transform",
          `translate(${event.clientX}px, ${event.clientY}px)`,
        );
      });
    };

    window.addEventListener("pointermove", movePointer);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", movePointer);
    };
  }, []);

  return (
    <svg
      ref={pointerRef}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="site-pointer pointer-events-none fixed top-0 left-0 z-[60] h-[30px] w-[30px] text-pink transition-transform duration-[60ms] ease-linear [transform:translate(-100px,-100px)]"
    >
      <path
        d="M4 2.5 26.2 14 16 17.2 12.3 27 4 2.5Z"
        fill="currentColor"
        stroke="white"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
