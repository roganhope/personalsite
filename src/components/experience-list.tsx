"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import posthog from "posthog-js";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import EasterEggButton from "@/components/easter-egg-button";
import ExperienceToggleIcon from "@/components/experience-toggle-icon";
import { roles, type Bullet, type Role } from "@/lib/content";

function renderFunFact(role: Role) {
  const { funFact, funFactLink, funFactEasterEgg } = role;
  const eggIndex = funFactEasterEgg ? funFact.indexOf(funFactEasterEgg.text) : -1;
  if (funFactEasterEgg && eggIndex !== -1) {
    return (
      <>
        {funFact.slice(0, eggIndex)}
        <EasterEggButton label={funFactEasterEgg.text} image={funFactEasterEgg.image} alt={funFactEasterEgg.alt} caption={funFactEasterEgg.caption} role={role.title} />
        {funFact.slice(eggIndex + funFactEasterEgg.text.length)}
      </>
    );
  }

  const linkIndex = funFactLink ? funFact.indexOf(funFactLink.text) : -1;
  if (!funFactLink || linkIndex === -1) return funFact;

  return (
    <>
      {funFact.slice(0, linkIndex)}
      <a
        href={funFactLink.href}
        target="_blank"
        rel="noreferrer"
        onClick={() => posthog.capture("fun_fact_link_clicked", { role: role.title, href: funFactLink.href })}
        className="underline hover:text-pink"
      >
        {funFactLink.text}
      </a>
      {funFact.slice(linkIndex + funFactLink.text.length)}
    </>
  );
}

// Consecutive bullets sharing a `group` render as one labelled list; bullets
// with no group stay in a single unlabelled list.
function groupBullets(bullets: Bullet[]) {
  const groups: { label?: string; bullets: Bullet[] }[] = [];
  for (const bullet of bullets) {
    const last = groups[groups.length - 1];
    if (last && last.label === bullet.group) last.bullets.push(bullet);
    else groups.push({ label: bullet.group, bullets: [bullet] });
  }
  return groups;
}

export default function ExperienceList() {
  const [openValue, setOpenValue] = useState(roles[0].title);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const handleValueChange = (value: string) => {
    const nextIndex = roles.findIndex((role) => role.title === value);
    const role = value ? roles[nextIndex] : roles.find((role) => role.title === openValue);
    setOpenValue(value);
    if (role) {
      posthog.capture("experience_role_toggled", { role: role.title, action: value ? "expand" : "collapse" });
    }
    if (value) {
      itemRefs.current[nextIndex]?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={openValue}
      onValueChange={handleValueChange}
      className="mx-auto grid w-[min(100%,1000px)] gap-2.5 text-left"
    >
      {roles.map((role, index) => {
        const isOpen = openValue === role.title;
        return (
          <AccordionItem key={role.title} value={role.title} asChild>
            <motion.article
              layout="position"
              transition={{ type: "spring", stiffness: 500, damping: 50 }}
              ref={(el: HTMLElement | null) => {
                itemRefs.current[index] = el;
              }}
              className="overflow-hidden rounded-[20px] border border-line bg-surface"
            >
              <AccordionTrigger className="group grid w-full cursor-pointer grid-cols-[1fr_auto_20px] items-center gap-5 border-0 bg-transparent px-6 py-[23px] text-left text-inherit [font:inherit] max-[700px]:relative max-[700px]:grid-cols-1 max-[700px]:gap-2.5 max-[700px]:pr-[55px]">
                <div>
                  <p className="m-0 text-[1.05rem] font-bold">{role.title}</p>
                  <p className="m-0 text-muted text-[.92rem]">
                    {role.company}
                    {role.companyDescription && (
                      <>
                        <span aria-hidden="true" className="mx-1.5">
                          ·
                        </span>
                        <em className="italic">{role.companyDescription}</em>
                      </>
                    )}
                  </p>
                </div>
                <time className="text-[.76rem] font-[750] whitespace-nowrap">{role.years}</time>
                <ExperienceToggleIcon isOpen={isOpen} />
              </AccordionTrigger>
              <AccordionContent className={`border-t ${isOpen ? "border-line" : "border-transparent"}`}>
                <div className="px-6 pt-[22px] pb-[25px]">
                  {role.summary && <p className="m-0 mb-4 text-[.92rem] text-muted">{role.summary}</p>}
                  <div className="space-y-4">
                    {groupBullets(role.bullets).map((group, groupIndex) => (
                      <div key={groupIndex}>
                        {group.label && (
                          <p className="m-0 mb-2 text-[.72rem] font-[850] tracking-[.13em] text-eyebrow uppercase">
                            {group.label}
                          </p>
                        )}
                        <ul className="m-0 list-disc space-y-2 pl-5 text-[.92rem] text-muted marker:text-pink">
                          {group.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>
                              {bullet.lead && <strong className="font-bold text-ink">{bullet.lead}</strong>}
                              {bullet.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 pl-5 text-[.92rem]">
                    <span className="font-bold text-pink">Fun Fact: </span>
                    <em className="text-muted italic">{renderFunFact(role)}</em>
                  </p>
                </div>
              </AccordionContent>
            </motion.article>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
