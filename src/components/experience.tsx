import ExperienceList from "./experience-list";
import Section from "./section";
import Wrap from "./wrap";

export default function Experience() {
  return (
    <Section>
      <Wrap>
        <p className="m-0 mb-8 text-[.72rem] font-[850] tracking-[.13em] text-eyebrow uppercase">
          Relevant work history
        </p>
        <ExperienceList />
      </Wrap>
    </Section>
  );
}
