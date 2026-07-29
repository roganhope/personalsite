import Section from "./section";
import Wrap from "./wrap";

export default function Mission() {
  return (
    <Section id="about">
      <Wrap>
        <p className="m-0 mb-3 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">My mission</p>
        <h2 className="mx-auto mb-10.5 max-w-[680px] text-[clamp(2.25rem,5vw,4.15rem)] leading-[.98] font-bold tracking-[-.07em]">
          If you can dream it,
          <br />
          you can build it.
        </h2>
        <p className="mx-auto max-w-[690px] text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.35] tracking-[-.035em]">
          From an early idea to a delivered product, I love being part of every step. AI has made it possible to
          build more broadly and move ideas forward faster - across{" "}
          <strong className="box-decoration-clone bg-[linear-gradient(to_top,transparent_0,transparent_.04em,var(--color-pink)_.04em,var(--color-pink)_.2em,transparent_.2em,transparent_3em)] font-bold">
            people, design, and technical architecture.
          </strong>
        </p>
      </Wrap>
    </Section>
  );
}
