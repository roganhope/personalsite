"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { File, Folder, Tree } from "./magicui/file-tree";
import Section from "./section";
import Wrap from "./wrap";
import { skillCategories } from "@/lib/content";

/** Filenames in public/skill-icons, keyed by skill label. Omitted skills fall back to the generic file icon. */
const skillIcons: Record<string, string> = {
  Python: "python.svg",
  Java: "java.svg",
  TypeScript: "typescript.svg",
  JavaScript: "javascript.svg",
  "HTML/CSS": "html5.svg",
  jQuery: "jquery.svg",
  PHP: "php.svg",
  LaTeX: "latex.svg",
  "Next.js": "nextjs.svg",
  "Spring Boot": "springboot.svg",
  React: "react.svg",
  "Node.js": "nodejs.svg",
  FastAPI: "fastapi.svg",
  Flask: "flask.svg",
  Django: "django.svg",
  Bootstrap: "bootstrap.svg",
  Tailwind: "tailwindcss.svg",
  Git: "git.svg",
  "Visual Studio": "visualstudio.svg",
  Slack: "slack.svg",
  Discord: "discord.svg",
  Miro: "miro.svg",
  Photoshop: "photoshop.svg",
  Jira: "jira.svg",
  Supabase: "supabase.svg",
  Vercel: "vercel.svg",
  AWS: "amazonwebservices.svg",
  DynamoDB: "dynamodb.svg",
  Docker: "docker.svg",
  "GitHub Actions": "githubactions.svg",
  GCP: "googlecloud.svg",
  Heroku: "heroku.svg",
  MySQL: "mysql.svg",
  MongoDB: "mongodb.svg",
  Postgres: "postgresql.svg",
  Redis: "redis.svg",
  "Claude Code": "claude.svg",
  Cursor: "cursor.svg",
  "Google AI SDK": "googlegemini.svg",
  "Anthropic API": "anthropic.svg",
  "Spring AI": "spring.svg",
  TensorFlow: "tensorflow.svg",
  Keras: "keras.svg",
  pandas: "pandas.svg",
  PostHog: "posthog.svg",
  NumPy: "numpy.svg",
  Matplotlib: "matplotlib.svg",
  Pytest: "pytest.svg",
};

function SkillIcon({ skill }: { skill: string }) {
  const file = skillIcons[skill];
  if (!file) return undefined;
  // eslint-disable-next-line @next/next/no-img-element -- small static logo, next/image doesn't optimize local SVGs
  return <img src={`/skill-icons/${file}`} alt="" className="h-4 w-4 shrink-0 object-contain" />;
}

const TALL_THRESHOLD_PX = 400;

export default function Skills() {
  const [expandedItems, setExpandedItems] = useState<string[]>([skillCategories[0].label]);
  const [isTall, setIsTall] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new ResizeObserver(([entry]) => {
      setIsTall(entry.contentRect.height > TALL_THRESHOLD_PX);
    });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const collapseAll = () => {
    posthog.capture("skill_tree_collapse_all_clicked");
    setExpandedItems([]);
  };
  const anyExpanded = expandedItems.length > 0;

  const handleExpandedItemsChange = (next: string[]) => {
    const expanded = next.find((item) => !expandedItems.includes(item));
    const collapsed = expandedItems.find((item) => !next.includes(item));
    if (expanded) posthog.capture("skill_category_toggled", { category: expanded, action: "expand" });
    if (collapsed) posthog.capture("skill_category_toggled", { category: collapsed, action: "collapse" });
    setExpandedItems(next);
  };

  return (
    <Section id="skills">
      <Wrap className="max-w-[560px]">
        <p className="m-0 mb-8 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">
          Skill Tree
        </p>
        <div ref={cardRef} className="relative rounded-[20px] border border-line bg-white/56 p-4 text-left">
          {isTall && (
            <button
              type="button"
              onClick={collapseAll}
              className="absolute top-1/2 right-full mr-4 hidden -translate-y-1/2 rounded-full border border-line bg-white/56 px-3 py-2 text-[.72rem] font-[850] tracking-[.1em] whitespace-nowrap text-muted uppercase transition-colors duration-150 hover:border-ink hover:text-ink min-[960px]:block"
            >
              Collapse all
            </button>
          )}
          <Tree sort="none" expandedItems={expandedItems} onExpandedItemsChange={handleExpandedItemsChange}>
            {skillCategories.map((category) => (
              <Folder key={category.label} value={category.label} element={category.label}>
                {category.skills.map((skill) => (
                  <File
                    key={`${category.label}/${skill}`}
                    value={`${category.label}/${skill}`}
                    fileIcon={<SkillIcon skill={skill} />}
                    onClick={() => posthog.capture("skill_clicked", { skill, category: category.label })}
                  >
                    <span>{skill}</span>
                  </File>
                ))}
              </Folder>
            ))}
          </Tree>
          {anyExpanded && (
            <button
              type="button"
              onClick={collapseAll}
              className="mt-3 hidden w-full rounded-full border border-line bg-white/56 px-3 py-2 text-[.72rem] font-[850] tracking-[.1em] text-muted uppercase transition-colors duration-150 hover:border-ink hover:text-ink max-[960px]:block"
            >
              Collapse all
            </button>
          )}
        </div>
      </Wrap>
    </Section>
  );
}
