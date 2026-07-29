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
    <Section id="work">
      <Wrap>
        <p className="m-0 mb-3 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">
          The résumé version
        </p>
        <h2 className="mx-auto mb-10.5 max-w-[680px] text-[clamp(2.25rem,5vw,4.15rem)] leading-[.98] font-bold tracking-[-.07em]">
          Relevant experience, minus the corporate poetry.
        </h2>
        <ExperienceList />
        <p className="mt-8">
          <Button href="/resume.pdf" target="_blank">
            <ResumeIcon />
            Grab the full résumé ↗
          </Button>
        </p>
      </Wrap>
    </Section>
  );
}
