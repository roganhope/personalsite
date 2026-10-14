import Link from "next/link";

const tabs = [
  { key: "builder", label: "Link builder", href: "/secret/admin" },
  { key: "usage", label: "Usage analytics", href: "/secret/admin/usage" },
] as const;

export type AdminTab = (typeof tabs)[number]["key"];

const linkClassName =
  "rounded-full px-4 py-2 text-[.75rem] font-[850] tracking-[.06em] uppercase transition-colors duration-150";

export default function AdminNav({ active }: { active: AdminTab }) {
  return (
    <nav
      aria-label="Admin"
      className="mb-10 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href="/"
        className={`${linkClassName} text-muted hover:text-ink`}
      >
        ← Back to site
      </Link>
      <span aria-hidden className="mx-1 h-5 w-px bg-line" />
      {tabs.map((tab) =>
        tab.key === active ? (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current="page"
            className={`${linkClassName} bg-ink text-paper`}
          >
            {tab.label}
          </Link>
        ) : (
          <Link
            key={tab.key}
            href={tab.href}
            className={`${linkClassName} border border-line text-ink hover:border-line-strong hover:bg-surface-hover`}
          >
            {tab.label}
          </Link>
        ),
      )}
    </nav>
  );
}
