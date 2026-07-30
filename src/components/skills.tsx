import Section from "./section";
import Wrap from "./wrap";
import { skillCategories } from "@/lib/content";

export default function Skills() {
  return (
    <Section id="skills">
      <Wrap>
        <p className="m-0 mb-8 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">
          What I work with
        </p>
        <div className="mx-auto grid w-[min(100%,800px)] gap-6 text-left">
          {skillCategories.map((category) => (
            <div key={category.label}>
              <h3 className="m-0 mb-3 text-[.92rem] font-bold">{category.label}</h3>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line bg-white/56 px-3.5 py-1.5 text-[.82rem] text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Wrap>
    </Section>
  );
}
