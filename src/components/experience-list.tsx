"use client";

import { useState } from "react";
import { roles } from "@/lib/content";

export default function ExperienceList() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto grid w-[min(100%,800px)] gap-2.5 text-left">
      {roles.map((role, index) => {
        const isOpen = openIndex === index;
        return (
          <article key={role.title} className="overflow-hidden rounded-[20px] border border-line bg-white/56">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="group grid w-full cursor-pointer grid-cols-[1.5fr_1fr_auto_20px] items-center gap-5 border-0 bg-transparent px-6 py-[23px] text-left text-inherit [font:inherit] max-[700px]:relative max-[700px]:grid-cols-1 max-[700px]:gap-2.5 max-[700px]:pr-[55px]"
            >
              <div>
                <h3 className="m-0 text-[1.05rem] font-bold">{role.title}</h3>
                <p className="m-0 text-muted text-[.92rem]">{role.company}</p>
              </div>
              <p className="m-0 text-muted text-[.92rem]">{role.focus}</p>
              <time className="text-[.76rem] font-[750] whitespace-nowrap">{role.years}</time>
              <span
                aria-hidden="true"
                className={`relative h-5 w-5 transition-[color,transform] duration-[220ms] ease-in-out group-hover:text-pink before:absolute before:top-1/2 before:left-0 before:h-[1.5px] before:w-full before:-translate-y-1/2 before:bg-current before:content-[''] after:absolute after:top-1/2 after:left-0 after:h-[1.5px] after:w-full after:-translate-y-1/2 after:rotate-90 after:bg-current after:transition-[transform,opacity] after:duration-[280ms] after:ease-in-out after:content-[''] max-[700px]:absolute max-[700px]:top-1/2 max-[700px]:right-6 max-[700px]:-mt-2.5 ${
                  isOpen ? "text-pink after:scale-x-0 after:opacity-0" : "group-hover:rotate-90"
                }`}
              />
            </button>
            <div
              aria-hidden={!isOpen}
              className={`grid border-t transition-[grid-template-rows_.38s_cubic-bezier(.22,1,.36,1),border-color_.38s_ease] ${
                isOpen ? "grid-rows-[1fr] border-line" : "grid-rows-[0fr] border-transparent"
              }`}
            >
              <div
                className={`grid min-h-0 overflow-hidden px-6 transition-[padding_.38s_cubic-bezier(.22,1,.36,1),opacity_.2s_ease,transform_.32s_ease] ${
                  isOpen
                    ? "translate-y-0 pt-[22px] pb-[25px] opacity-100"
                    : "-translate-y-2 pt-0 pb-0 opacity-0"
                }`}
              >
                <ul className="m-0 list-disc space-y-2 pl-5 text-[.92rem] text-muted marker:text-pink">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <p className="mt-4 text-[.92rem]">
                  <span className="font-bold text-pink">Fun Fact: </span>
                  <em className="text-muted italic">{role.funFact}</em>
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
