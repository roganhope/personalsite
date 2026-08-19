"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

/**
 * Spotlight-border card (adapted from magicui.design's MagicCard). The upstream
 * next-themes/orb mode is dropped — the gradient reads off this site's color
 * tokens, so it follows the theme on its own.
 */
export default function MagicCard({
  children,
  className = "",
  gradientSize = 200,
  gradientColor = "var(--color-pink)",
  gradientOpacity = 0.15,
  gradientFrom = "var(--color-pink)",
  gradientTo = "var(--color-ink)",
}: {
  children: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);
  const gradientSizeRef = useRef(gradientSize);

  useEffect(() => {
    gradientSizeRef.current = gradientSize;
  }, [gradientSize]);

  const reset = useCallback(() => {
    const off = -gradientSizeRef.current;
    mouseX.set(off);
    mouseY.set(off);
  }, [mouseX, mouseY]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset();
    };
    window.addEventListener("pointerout", handleGlobalPointerOut);
    return () => window.removeEventListener("pointerout", handleGlobalPointerOut);
  }, [reset]);

  return (
    <motion.div
      className={`group relative isolate overflow-hidden rounded-2xl border border-transparent ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{
        background: useMotionTemplate`
          linear-gradient(var(--color-paper) 0 0) padding-box,
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom},
            ${gradientTo},
            var(--color-line) 100%
          ) border-box
        `,
      }}
    >
      <div className="absolute inset-px z-20 rounded-[inherit] bg-surface-solid" />
      <motion.div
        className="pointer-events-none absolute inset-px z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 100%
            )
          `,
          opacity: gradientOpacity,
        }}
      />
      <div className="relative z-40">{children}</div>
    </motion.div>
  );
}
