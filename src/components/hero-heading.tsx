"use client";

import { motion } from "motion/react";
import { TextAnimate } from "./magicui/text-animate";
import { TypingAnimation } from "./magicui/typing-animation";

// Sequence: "Hi, " fades in letter by letter, a beat passes, then "I'm Hope."
// fades in letter by letter, then the pink underline draws in, then the
// subtitle types itself out.
const CHAR_ITEM_DURATION = 0.3; // matches TextAnimate's fadeIn item transition
const HI_STAGGER_SPAN = 0.15;
const PAUSE_AFTER_HI = 0.5;
const IM_HOPE_STAGGER_SPAN = 0.25;
const UNDERLINE_GAP = 0.15;
const UNDERLINE_DURATION = 0.35;
const GAP_BEFORE_SUBTITLE = 0.3;

const HI_DELAY = 0;
const IM_HOPE_DELAY =
  HI_DELAY + HI_STAGGER_SPAN + CHAR_ITEM_DURATION + PAUSE_AFTER_HI;
const HOPE_LETTERS_DONE = IM_HOPE_DELAY + IM_HOPE_STAGGER_SPAN + CHAR_ITEM_DURATION;
const UNDERLINE_DELAY = HOPE_LETTERS_DONE + UNDERLINE_GAP;
const SUBTITLE_DELAY_MS =
  (UNDERLINE_DELAY + UNDERLINE_DURATION + GAP_BEFORE_SUBTITLE) * 1000;

const SUBTITLE_TEXT = "Hope E. Rogan";
const SUBTITLE_MS_PER_CHAR = 100; // matches TypingAnimation's default `duration`

// When the subtitle finishes typing, in ms — exported so content that should
// only appear once the heading is fully done (e.g. the tagline and CTA
// button) can time their own entrance off of it.
export const HERO_HEADING_DONE_MS =
  SUBTITLE_DELAY_MS + SUBTITLE_TEXT.length * SUBTITLE_MS_PER_CHAR;

export default function HeroHeading() {
  return (
    <>
      <h1 className="mx-auto my-5.5 max-w-[900px] text-[clamp(3.25rem,10vw,7.8rem)] leading-[.91] font-bold tracking-[-.085em]">
        <TextAnimate
          as="span"
          by="character"
          animation="fadeIn"
          duration={HI_STAGGER_SPAN}
          delay={HI_DELAY}
          startOnView={false}
        >
          {"Hi, "}
        </TextAnimate>
        <TextAnimate
          as="span"
          by="character"
          animation="fadeIn"
          duration={IM_HOPE_STAGGER_SPAN}
          delay={IM_HOPE_DELAY}
          startOnView={false}
        >
          {"I'm "}
        </TextAnimate>
        <span className="relative z-0 inline-block">
          <TextAnimate
            as="span"
            by="character"
            animation="fadeIn"
            duration={IM_HOPE_STAGGER_SPAN}
            delay={IM_HOPE_DELAY}
            startOnView={false}
          >
            {"Hope."}
          </TextAnimate>
          <motion.span
            aria-hidden
            className="absolute right-[4%] bottom-[.05em] left-[4%] -z-10 h-[.14em] origin-left rotate-[-2deg] bg-pink"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: UNDERLINE_DELAY,
              duration: UNDERLINE_DURATION,
              ease: "easeOut",
            }}
          />
        </span>
      </h1>
      <TypingAnimation
        as="p"
        className="my-0 mt-[-8px] mb-7 min-h-[1lh] text-[clamp(.86rem,1.5vw,1rem)] font-bold tracking-[.13em] text-muted uppercase"
        delay={SUBTITLE_DELAY_MS}
        startOnView={false}
      >
        {SUBTITLE_TEXT}
      </TypingAnimation>
    </>
  );
}
