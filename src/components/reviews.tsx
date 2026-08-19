"use client";

import Image from "next/image";
import { useState } from "react";
import posthog from "posthog-js";
import { LinkedInIcon } from "./icons";
import ReviewForm from "./review-form";
import Section from "./section";
import Wrap from "./wrap";
import { reviews, type Review } from "@/lib/content";

/** Quotes longer than this collapse behind a "Read more" toggle. */
const CLAMP_THRESHOLD = 300;

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
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-[#f2eff0] text-[.85rem] font-extrabold text-muted">
      {initials}
    </div>
  );
}

function SourcePill({ review }: { review: Review }) {
  const linkedin = review.source === "linkedin";
  const pillClassName =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[.68rem] font-[850] tracking-[.08em] text-muted uppercase";
  const label = (
    <>
      {linkedin && <LinkedInIcon />}
      {linkedin ? "LinkedIn" : "Direct"}
    </>
  );
  if (!review.profileUrl) return <span className={pillClassName}>{label}</span>;
  return (
    <a
      href={review.profileUrl}
      target="_blank"
      rel="noreferrer"
      onClick={() => posthog.capture("review_source_clicked", { reviewer: review.name, href: review.profileUrl })}
      className={`${pillClassName} transition-colors duration-150 hover:border-[#0a66c2] hover:text-[#0a66c2]`}
    >
      {label}
    </a>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const clampable = review.quote.length > CLAMP_THRESHOLD;

  const toggle = () => {
    posthog.capture("review_expanded", { reviewer: review.name, action: expanded ? "collapse" : "expand" });
    setExpanded(!expanded);
  };

  return (
    <article className="flex flex-col rounded-[20px] border border-line bg-white/56 p-6 text-left shadow-[0_8px_24px_rgba(23,21,22,.05)]">
      <div className="flex items-start gap-3.5">
        <ReviewerPhoto review={review} />
        <div className="min-w-0 flex-1">
          <h3 className="m-0 text-[1rem] font-bold tracking-[-.02em]">{review.name}</h3>
          <p className="m-0 mt-0.5 text-[.78rem] text-muted">{review.title}</p>
        </div>
        <SourcePill review={review} />
      </div>
      <blockquote
        className={`m-0 mt-4 text-[.92rem] leading-relaxed text-muted ${clampable && !expanded ? "line-clamp-6" : ""}`}
      >
        <Quote quote={review.quote} highlight={review.highlight} />
      </blockquote>
      {clampable && (
        <button
          type="button"
          onClick={toggle}
          className="mt-2 self-start text-[.72rem] font-extrabold tracking-[.08em] text-pink uppercase transition-colors duration-150 hover:text-ink"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
      <footer className="mt-4 border-t border-line pt-3 text-[.75rem] text-muted">
        {review.relationship} · {review.date}
      </footer>
    </article>
  );
}

function ShareCard() {
  const [open, setOpen] = useState(false);

  const openForm = () => {
    posthog.capture("review_form_opened");
    setOpen(true);
  };

  return (
    <div className="col-span-full rounded-[20px] border border-dashed border-[#d2cdcf] bg-white/30 p-6 text-left">
      {open ? (
        <ReviewForm />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="m-0 text-[1.05rem] font-bold tracking-[-.03em]">Your words could be here</p>
            <p className="m-0 mt-1 text-[.9rem] text-muted">
              Worked with me? I&apos;d love to hear what you&apos;d say.
            </p>
          </div>
          <button
            type="button"
            onClick={openForm}
            className="inline-flex items-center justify-center rounded-full border border-ink bg-ink px-5 py-3.5 text-[.8rem] font-[850] tracking-[.06em] text-white uppercase shadow-[4px_4px_0_var(--color-pink)] transition-[transform,background,color,box-shadow] duration-[180ms] hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-pink hover:text-ink hover:shadow-[1px_1px_0_var(--color-pink)]"
          >
            Share yours
          </button>
        </div>
      )}
    </div>
  );
}

export default function Reviews() {
  return (
    <Section id="reviews">
      <Wrap>
        <p className="m-0 mb-3 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">
          What people say
        </p>
        <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
          <ShareCard />
        </div>
      </Wrap>
    </Section>
  );
}
