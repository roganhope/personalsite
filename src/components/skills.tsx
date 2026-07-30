import { Tree, type TreeViewElement } from "./magicui/file-tree";
import Section from "./section";
import Wrap from "./wrap";
import { skillCategories } from "@/lib/content";

const elements: TreeViewElement[] = skillCategories.map((category) => ({
  id: category.label,
  name: category.label,
  type: "folder",
  children: category.skills.map((skill) => ({
    id: `${category.label}/${skill}`,
    name: skill,
    type: "file",
  })),
}));

export default function Skills() {
  return (
    <Section id="skills">
      <Wrap className="max-w-[560px]">
        <p className="m-0 mb-8 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">
          What I work with
        </p>
        <div className="rounded-[20px] border border-line bg-white/56 p-4 text-left">
          <Tree elements={elements} sort="none" initialExpandedItems={[skillCategories[0].label]} />
        </div>
      </Wrap>
    </Section>
  );
}
