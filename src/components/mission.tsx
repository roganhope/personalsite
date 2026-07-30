import Image from "next/image";
import Section from "./section";
import Wrap from "./wrap";

export default function Mission() {
  return (
    <Section id="about">
      <Wrap>
        <div className="flex flex-col items-center gap-10 text-center max-[700px]:gap-8 min-[700px]:flex-row min-[700px]:text-left">
          <div className="min-[700px]:flex-1">
            <p className="m-0 mb-3 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">My mission</p>
            <h2 className="mb-10.5 text-[clamp(2.25rem,5vw,4.15rem)] leading-[.98] font-bold tracking-[-.07em] max-[700px]:mx-auto max-[700px]:max-w-[680px]">
              If you can dream it,
              <br />
              you can build it.
            </h2>
            <p className="text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.35] tracking-[-.035em] max-[700px]:mx-auto max-[700px]:max-w-[690px]">
              From an early idea to a delivered product, I love being part of every step. AI has made it possible to
              build more broadly and move ideas forward faster - across{" "}
              <strong className="box-decoration-clone bg-[linear-gradient(to_top,transparent_0,transparent_.04em,var(--color-pink)_.04em,var(--color-pink)_.2em,transparent_.2em,transparent_3em)] font-bold">
                people, design, and technical architecture.
              </strong>
            </p>
          </div>
          <div className="relative aspect-[3474/2828] w-full max-w-[420px] shrink-0 overflow-hidden rounded-[20px] border border-line bg-[#f2eff0] min-[700px]:w-[380px]">
            <Image
              src="/hope.webp"
              alt="Hope smiling, holding a laptop"
              fill
              sizes="(max-width: 700px) 90vw, 380px"
              className="object-cover"
            />
          </div>
        </div>
      </Wrap>
    </Section>
  );
}
