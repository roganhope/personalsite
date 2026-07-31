"use client";

import { motion } from "motion/react";
import posthog from "posthog-js";
import Button from "./button";
import Wrap from "./wrap";
import HeroHeading, { HERO_HEADING_DONE_MS } from "./hero-heading";

const GAP_AFTER_HEADING = 0.3;
const FADE_DURATION = 0.4;
const TAGLINE_DELAY = HERO_HEADING_DONE_MS / 1000 + GAP_AFTER_HEADING;
const BUTTON_DELAY = TAGLINE_DELAY + 0.15;

export default function Hero() {
  return (
    <section className="border-t border-line">
      <Wrap className="grid min-h-[calc(100vh-84px)] place-items-center px-0 py-17.5 pb-25 text-center">
        <div>
          <HeroHeading />
          <motion.p
            className="mx-auto mb-8 max-w-[540px] text-[1.08rem] text-[#3e3d3a]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: TAGLINE_DELAY, duration: FADE_DURATION }}
          >
            I work in Product Management, Engineering and AI.
          </motion.p>
          <motion.div
            className="inline-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: BUTTON_DELAY, duration: FADE_DURATION }}
          >
            <Button href="/#contact" onClick={() => posthog.capture("hero_cta_clicked")}>
              Let&apos;s make something ↘
            </Button>
          </motion.div>
        </div>
      </Wrap>
    </section>
  );
}
