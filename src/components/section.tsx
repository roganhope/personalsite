/**
 * Every section but the hero shares this padding/border/alignment exactly, so
 * it's centralized here rather than repeated per section.
 */
export default function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`border-t border-line px-0 py-[105px] text-center max-[700px]:py-[75px] ${className}`}
    >
      {children}
    </section>
  );
}
