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

export default function Skills() {
  return (
    <Section id="skills">
      <Wrap className="max-w-[560px]">
        <p className="m-0 mb-8 text-[.72rem] font-[850] tracking-[.13em] text-[#62605c] uppercase">
          What I work with
        </p>
        <div className="rounded-[20px] border border-line bg-white/56 p-4 text-left">
          <Tree sort="none" initialExpandedItems={[skillCategories[0].label]}>
            {skillCategories.map((category) => (
              <Folder key={category.label} value={category.label} element={category.label}>
                {category.skills.map((skill) => (
                  <File
                    key={`${category.label}/${skill}`}
                    value={`${category.label}/${skill}`}
                    fileIcon={<SkillIcon skill={skill} />}
                  >
                    <span>{skill}</span>
                  </File>
                ))}
              </Folder>
            ))}
          </Tree>
        </div>
      </Wrap>
    </Section>
  );
}
