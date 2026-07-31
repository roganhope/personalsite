"use client";

import Image from "next/image";
import posthog from "posthog-js";
import Section from "./section";
import Wrap from "./wrap";
import { projects } from "@/lib/content";

export default function Projects() {
  return (
    <Section id="portfolio">
      <Wrap>
        <p className="m-0 mb-3 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">
          Highlighted projects
        </p>
        <div className="grid grid-cols-3 gap-4 text-left max-[700px]:grid-cols-1">
          {projects.map((project) => {
            const external = project.href.startsWith("http");
            return (
              <article
                key={project.title}
                className="relative flex min-h-[280px] cursor-pointer flex-col justify-between rounded-[20px] border border-line bg-white/56 p-6 shadow-[0_8px_24px_rgba(23,21,22,.05)] transition duration-200 hover:-translate-y-[5px] hover:border-[#d2cdcf] hover:bg-[#f2f0f1] hover:shadow-[0_14px_30px_rgba(23,21,22,.09)]"
              >
                <div className="relative -mx-2 -mt-2 mb-4.5 h-[132px] overflow-hidden rounded-[13px] border border-line bg-[#f2eff0]">
                  <Image
                    src={project.image}
                    alt={`${project.title} website`}
                    fill
                    sizes="(max-width: 700px) 100vw, 33vw"
                    className={
                      project.fit === "contain"
                        ? "bg-[#0d0d10] object-contain p-2.5"
                        : "object-cover object-top"
                    }
                  />
                </div>
                <small className="text-[.78rem] font-extrabold tracking-[.08em] text-pink">{project.label}</small>
                <div>
                  <h3 className="mt-3.5 mb-2 text-[1.35rem] font-bold tracking-[-.045em]">{project.title}</h3>
                  <p className="m-0 text-[.92rem] text-muted">{project.copy}</p>
                </div>
                <a
                  href={project.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  onClick={() => posthog.capture("project_link_clicked", { project: project.title, href: project.href })}
                  className="mt-5 self-end text-[.78rem] font-extrabold tracking-[.06em] uppercase after:absolute after:inset-0 after:content-['']"
                >
                  View ↗
                </a>
              </article>
            );
          })}
        </div>
      </Wrap>
    </Section>
  );
}
