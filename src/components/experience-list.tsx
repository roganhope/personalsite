"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import posthog from "posthog-js";
import { roles } from "@/lib/content";

export default function ExperienceList() {
  const [openIndex, setOpenIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const toggleRole = (index: number, isOpen: boolean) => {
    const role = roles[index];
    setOpenIndex(isOpen ? -1 : index);
    posthog.capture("experience_role_toggled", { role: role.title, action: isOpen ? "collapse" : "expand" });
    if (!isOpen) {
      itemRefs.current[index]?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-auto grid w-[min(100%,800px)] gap-2.5 text-left">
      {roles.map((role, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.article
            key={role.title}
            layout="position"
            transition={{ type: "spring", stiffness: 500, damping: 50 }}
            ref={(el: HTMLElement | null) => {
              itemRefs.current[index] = el;
            }}
            className="overflow-hidden rounded-[20px] border border-line bg-white/56"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggleRole(index, isOpen)}
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
            <motion.div
              layout
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      height: { type: "spring", stiffness: 500, damping: 40 },
                      opacity: { duration: 0.2 },
                    }
              }
              aria-hidden={!isOpen}
              className={`overflow-hidden border-t ${isOpen ? "border-line" : "border-transparent"}`}
            >
              <div className="px-6 pt-[22px] pb-[25px]">
                <ul className="m-0 list-disc space-y-2 pl-5 text-[.92rem] text-muted marker:text-pink">
                  {role.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>
                      {bullet.lead && <strong className="font-bold text-ink">{bullet.lead}</strong>}
                      {bullet.text}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 pl-5 text-[.92rem]">
                  <span className="font-bold text-pink">Fun Fact: </span>
                  <em className="text-muted italic">{role.funFact}</em>
                </p>
              </div>
            </motion.div>
          </motion.article>
        );
      })}
    </div>
  );
}
