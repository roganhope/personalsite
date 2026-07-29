"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./button";

const COUNTDOWN_SECONDS = 10;

/**
 * Home button with a bar that drains over COUNTDOWN_SECONDS and redirects
 * automatically when it empties. Clicking the button still navigates home
 * immediately, same as a normal link.
 */
export default function CountdownHomeButton() {
  const router = useRouter();
  const [draining, setDraining] = useState(false);

  useEffect(() => {
    // Mount at full width, then flip to drained on the next frame so the
    // browser has committed the "full" state and animates the transition
    // instead of jumping straight to empty.
    const raf = requestAnimationFrame(() => setDraining(true));
    const redirect = setTimeout(() => router.push("/"), COUNTDOWN_SECONDS * 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <Button href="/" className="relative pb-5">
      Take me home ↘
      <span aria-hidden="true" className="absolute inset-x-5 bottom-2 h-[3px] rounded-full bg-white/25" />
      <span
        aria-hidden="true"
        className={`absolute inset-x-5 bottom-2 h-[3px] origin-left rounded-full bg-white transition-transform ease-linear motion-reduce:duration-0 ${
          draining ? "scale-x-0" : "scale-x-100"
        }`}
        style={{ transitionDuration: `${COUNTDOWN_SECONDS}s` }}
      />
    </Button>
  );
}
