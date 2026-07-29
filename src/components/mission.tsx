import Section from "./section";
import Wrap from "./wrap";

export default function Mission() {
  return (
    <Section id="about">
      <Wrap>
        <p className="m-0 mb-3 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">My mission</p>
        <h2 className="mx-auto mb-10.5 max-w-[680px] text-[clamp(2.25rem,5vw,4.15rem)] leading-[.98] font-bold tracking-[-.07em]">
          If you can dream it, you can build it.
        </h2>
        <p className="mx-auto max-w-[690px] text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.35] tracking-[-.035em]">
          From an early idea to a delivered product, I love being part of every step. AI has made it possible to
          build more broadly and move ideas forward faster - across{" "}
          <strong className="relative z-0 font-bold after:absolute after:-z-10 after:right-[-.08em] after:bottom-[.04em] after:left-[-.08em] after:h-[.16em] after:bg-pink after:content-['']">
            people, design, and technical architecture.
          </strong>
        </p>
      </Wrap>
    </Section>
  );
}
