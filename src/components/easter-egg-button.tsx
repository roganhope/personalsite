"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import posthog from "posthog-js";

const subscribe = () => () => {};

export default function EasterEggButton({
  label,
  image,
  alt,
  caption,
  role,
}: {
  label: string;
  /** Path under public/. */
  image: string;
  alt: string;
  caption?: string;
  role: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Body overflow to put back when the popup closes; null while unlocked.
  const savedOverflow = useRef<string | null>(null);

  const unlockScroll = () => {
    if (savedOverflow.current === null) return;
    document.body.style.overflow = savedOverflow.current;
    savedOverflow.current = null;
  };
  useEffect(() => unlockScroll, []);
  // A <dialog> can't live inside the fun fact's <p>, so it's portaled to <body>
  // once we're on the client.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          // A modal <dialog> doesn't stop the page behind it from scrolling.
          savedOverflow.current ??= document.body.style.overflow;
          document.body.style.overflow = "hidden";
          dialogRef.current?.showModal();
          posthog.capture("easter_egg_opened", { role });
        }}
        className="cursor-pointer border-0 bg-transparent p-0 text-inherit underline [font:inherit] hover:text-pink"
      >
        {label}
      </button>
      {mounted &&
        createPortal(
          <dialog
            ref={dialogRef}
            aria-label={alt}
            onClose={unlockScroll}
            // Only a click on the backdrop lands on the <dialog> itself: its
            // padding lives on the inner div so the photo area doesn't count.
            onClick={(event) => {
              if (event.target === event.currentTarget) event.currentTarget.close();
            }}
            className="m-auto w-[min(92vw,720px)] rounded-[20px] border border-line bg-surface-solid p-0 text-ink backdrop:bg-footer/75"
          >
            <div className="relative p-3">
              <Image src={image} alt={alt} width={1200} height={812} sizes="(max-width: 760px) 92vw, 696px" className="h-auto w-full rounded-[12px]" />
              {caption && <p className="m-0 mt-3 text-center text-[.92rem] text-muted italic">{caption}</p>}
              <form method="dialog" className="absolute top-5 right-5">
                <button
                  type="submit"
                  aria-label="Close"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-footer/70 text-footer-ink hover:bg-footer"
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </form>
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
}
