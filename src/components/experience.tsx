"use client";

import posthog from "posthog-js";
import Button from "./button";
import ExperienceList from "./experience-list";
import Section from "./section";
import Wrap from "./wrap";

function ResumeIcon() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-block h-[19px] w-4 rounded-[3px] border-[1.5px] border-current after:absolute after:top-1.5 after:right-[3px] after:left-[3px] after:h-px after:bg-current after:shadow-[0_4px_0_currentColor] after:content-['']"
    />
  );
}

export default function Experience() {
  return (
    <Section>
      <Wrap>
        <p className="m-0 mb-8 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">
          The résumé version
        </p>
        <ExperienceList />
        <p className="mt-8">
          <Button
            href="/resume.pdf"
            target="_blank"
            onClick={() => posthog.capture("resume_clicked")}
          >
            <ResumeIcon />
            Résumé coming soon ↗
          </Button>
        </p>
      </Wrap>
    </Section>
  );
}
