"use client";

import Link from "next/link";
import { Children, cloneElement, isValidElement, useRef } from "react";
import { motion, type MotionValue, useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * Adapted from magicui.design's Dock (react + tailwindcss + motion), trimmed
 * to this site's actual dependencies (no class-variance-authority, no cn()
 * helper, no Radix tooltip). Class lists are copied verbatim from upstream;
 * the only structural change is rendering each icon as a Link/anchor instead
 * of a plain div, since every icon in this dock navigates somewhere.
 */

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_DISABLE_MAGNIFICATION = false;

type DockIconInjectedProps = {
  mouseX?: MotionValue<number>;
  size?: number;
  magnification?: number;
  disableMagnification?: boolean;
  distance?: number;
};

export function Dock({
  children,
  className = "",
  iconSize = DEFAULT_SIZE,
  iconMagnification = DEFAULT_MAGNIFICATION,
  disableMagnification = DEFAULT_DISABLE_MAGNIFICATION,
  iconDistance = DEFAULT_DISTANCE,
  direction = "middle",
}: {
  children: React.ReactNode;
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  disableMagnification?: boolean;
  iconDistance?: number;
  direction?: "top" | "middle" | "bottom";
}) {
  const mouseX = useMotionValue(Infinity);

  const renderChildren = () =>
    Children.map(children, (child) => {
      if (isValidElement<DockIconInjectedProps>(child) && child.type === DockIcon) {
        return cloneElement(child, {
          mouseX,
          size: iconSize,
          magnification: iconMagnification,
          disableMagnification,
          distance: iconDistance,
        });
      }
      return child;
    });

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto mt-8 flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl border p-2 backdrop-blur-md ${
        direction === "top" ? "items-start" : direction === "bottom" ? "items-end" : "items-center"
      } ${className}`}
    >
      {renderChildren()}
    </motion.div>
  );
}

export function DockIcon({
  href,
  ariaLabel,
  target,
  rel,
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  disableMagnification = DEFAULT_DISABLE_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className = "",
  children,
}: DockIconInjectedProps & {
  href: string;
  ariaLabel: string;
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const defaultMouseX = useMotionValue(Infinity);
  const padding = Math.max(6, size * 0.2);

  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const targetSize = disableMagnification ? size : magnification;

  const sizeTransform = useTransform(distanceCalc, [-distance, 0, distance], [size, targetSize, size]);
  const scaleSize = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const isExternal = href.startsWith("http");
  const wrapperClassName = `flex aspect-square cursor-pointer items-center justify-center rounded-full ${
    disableMagnification ? "hover:bg-muted-foreground transition-colors" : ""
  } ${className}`;

  const props = { "aria-label": ariaLabel, title: ariaLabel };

  return (
    <motion.div ref={ref} style={{ width: scaleSize, height: scaleSize, padding }} className={wrapperClassName}>
      {isExternal ? (
        <a href={href} target={target} rel={rel} {...props}>
          {children}
        </a>
      ) : (
        <Link href={href} {...props}>
          {children}
        </Link>
      )}
    </motion.div>
  );
}
