import Pills from "./pills";
import Section from "./section";
import Wrap from "./wrap";
import { skillGroups } from "@/lib/content";

export default function Toolbox() {
  return (
    <Section>
      <Wrap>
        <p className="m-0 mb-3 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">Toolbox</p>
        <div className="mx-auto grid w-[min(100%,760px)] gap-3 text-left">
          {skillGroups.map((group) => (
            <article
              key={group.category}
              className="grid grid-cols-[135px_1fr] items-center gap-6 rounded-[20px] border border-line bg-white/58 px-6.5 py-5.5 max-[700px]:grid-cols-1 max-[700px]:gap-2.5"
            >
              <h3 className="m-0 text-[.77rem] tracking-[.1em] uppercase">{group.category}</h3>
              <Pills items={group.skills} />
            </article>
          ))}
        </div>
      </Wrap>
    </Section>
  );
}
