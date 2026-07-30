"use client";

import Link from "next/link";
import { Children, cloneElement, isValidElement, useRef } from "react";
import { motion, type MotionValue, useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * Adapted from magicui.design's Dock, trimmed to this site's actual
 * dependencies (no class-variance-authority, no cn() helper, no Radix
 * tooltip). Visual styling is kept close to the original component.
 */

const DEFAULT_SIZE = 44;
const DEFAULT_MAGNIFICATION = 64;
const DEFAULT_DISTANCE = 140;

type DockIconInjectedProps = {
  mouseX?: MotionValue<number>;
  size?: number;
  magnification?: number;
  distance?: number;
};

export function Dock({
  children,
  className = "",
  iconSize = DEFAULT_SIZE,
  iconMagnification = DEFAULT_MAGNIFICATION,
  iconDistance = DEFAULT_DISTANCE,
}: {
  children: React.ReactNode;
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
}) {
  const mouseX = useMotionValue(Infinity);

  const renderChildren = () =>
    Children.map(children, (child) => {
      if (isValidElement<DockIconInjectedProps>(child) && child.type === DockIcon) {
        return cloneElement(child, {
          mouseX,
          size: iconSize,
          magnification: iconMagnification,
          distance: iconDistance,
        });
      }
      return child;
    });

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl border border-line bg-white/70 p-2 backdrop-blur-md ${className}`}
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
  distance = DEFAULT_DISTANCE,
  mouseX,
  children,
}: DockIconInjectedProps & {
  href: string;
  ariaLabel: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const defaultMouseX = useMotionValue(Infinity);
  const padding = Math.max(6, size * 0.22);

  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(distanceCalc, [-distance, 0, distance], [size, magnification, size]);
  const scaleSize = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const isExternal = href.startsWith("http");
  const linkClassName = "flex h-full w-full cursor-pointer items-center justify-center rounded-full text-ink";

  return (
    <motion.div
      ref={ref}
      style={{ width: scaleSize, height: scaleSize, padding }}
      className="flex aspect-square items-center justify-center"
    >
      {isExternal ? (
        <a href={href} target={target} rel={rel} aria-label={ariaLabel} title={ariaLabel} className={linkClassName}>
          {children}
        </a>
      ) : (
        <Link href={href} aria-label={ariaLabel} title={ariaLabel} className={linkClassName}>
          {children}
        </Link>
      )}
    </motion.div>
  );
}
