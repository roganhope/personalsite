"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import { LinkedInIcon } from "./icons";
import type { Review } from "@/lib/content";

function Quote({ quote, highlight }: { quote: string; highlight?: string }) {
  const start = highlight ? quote.indexOf(highlight) : -1;
  if (!highlight || start === -1) return <>{quote}</>;
  return (
    <>
      {quote.slice(0, start)}
      <strong className="font-bold text-ink">{highlight}</strong>
      {quote.slice(start + highlight.length)}
    </>
  );
}

function ReviewerPhoto({ review }: { review: Review }) {
  if (review.photo) {
    return (
      <Image
        src={review.photo}
        alt={review.name}
        width={48}
        height={48}
        className="h-12 w-12 shrink-0 rounded-full border border-line object-cover"
      />
    );
  }
  const initials = review.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface-sunken text-[.85rem] font-extrabold text-muted">
      {initials}
    </div>
  );
}

function SourcePill({ review }: { review: Review }) {
  const linkedin = review.source === "linkedin";
  const pillClassName = `inline-flex shrink-0 items-center rounded-full border border-line bg-surface-solid px-2.5 py-1 ${
    linkedin ? "text-[#0a66c2]" : "text-[.68rem] font-[850] tracking-[.08em] text-muted uppercase"
  }`;
  const label = linkedin ? <LinkedInIcon /> : "Direct";
  if (!review.profileUrl) return <span className={pillClassName}>{label}</span>;
  return (
    <a
      href={review.profileUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={linkedin ? `${review.name} on LinkedIn` : undefined}
      onClick={() => posthog.capture("review_source_clicked", { reviewer: review.name, href: review.profileUrl })}
      className={`${pillClassName} transition-colors duration-150 hover:border-[#0a66c2]`}
    >
      {label}
    </a>
  );
}

/**
 * One testimonial. It spans three rows (header, quote, footer) of its parent via
 * subgrid, so it must sit inside a `ReviewGrid`: side by side, cards then share
 * row heights and quotes start, and dividers sit, at the same height.
 */
export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="row-span-3 grid grid-rows-subgrid gap-y-0 border border-line bg-surface p-6 text-left shadow-card">
      <div className="flex items-start gap-3.5">
        <ReviewerPhoto review={review} />
        <div className="min-w-0 flex-1">
          <h3 className="m-0 text-[1rem] font-bold tracking-[-.02em]">{review.name}</h3>
          <p className="m-0 mt-0.5 text-[.78rem] text-muted">{review.title}</p>
        </div>
        <SourcePill review={review} />
      </div>
      <blockquote className="m-0 mt-4 text-[.92rem] leading-relaxed text-muted">
        <Quote quote={review.quote} highlight={review.highlight} />
      </blockquote>
      <footer className="mt-4 border-t border-line pt-3 text-[.75rem] text-muted">
        {review.relationship} · {review.date}
      </footer>
    </article>
  );
}

/** Two-up grid (one column on phones) whose rows `ReviewCard`s share through subgrid. */
export function ReviewGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 grid-rows-[auto_1fr_auto] gap-4 max-[700px]:grid-cols-1">{children}</div>;
}
