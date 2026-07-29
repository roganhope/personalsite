import type { Skill } from "@/lib/content";

export default function Pills({ items, className = "" }: { items: Skill[]; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <span
          key={item.name}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/56 px-2.5 py-1.5 text-[.82rem]"
        >
          <b className="grid h-[17px] w-[17px] place-items-center rounded-full bg-ink text-[.6rem] font-normal text-white">
            {item.initial}
          </b>
          {item.name}
        </span>
      ))}
    </div>
  );
}
