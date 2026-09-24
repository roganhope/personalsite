import Image from "next/image";
import Section from "./section";
import Wrap from "./wrap";
import { education } from "@/lib/content";

export default function Education() {
  return (
    <Section id="education">
      <Wrap>
        <p className="m-0 mb-8 text-[.72rem] font-[850] tracking-[.13em] text-eyebrow uppercase">
          Education
        </p>
        <div className="mx-auto grid w-[min(100%,1000px)] gap-2.5 text-left">
          {education.map((entry) => (
            <article
              key={entry.school}
              className="flex items-center gap-5 rounded-[20px] border border-line bg-surface px-6 py-3.5 max-[700px]:items-start max-[700px]:gap-4"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-surface-sunken p-1">
                <Image
                  src={entry.logo}
                  alt=""
                  width={40}
                  height={40}
                  className={`h-full w-full object-contain ${entry.monochrome ? "dark:invert" : ""}`}
                />
              </div>
              <div className="flex flex-1 items-center justify-between gap-5 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-2.5">
                <div>
                  <p className="m-0 text-[1.05rem] font-bold">{entry.degree}</p>
                  <p className="m-0 text-[.92rem] text-muted">
                    {entry.school} · {entry.location}
                  </p>
                </div>
                <time className="text-[.76rem] font-[750] whitespace-nowrap">{entry.years}</time>
              </div>
            </article>
          ))}
        </div>
      </Wrap>
    </Section>
  );
}
