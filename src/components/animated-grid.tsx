const CELL_COUNT = 252;

const cells = Array.from({ length: CELL_COUNT }, (_, index) => index);

/**
 * Fixed background of grid cells, a scattered subset of which pulses pink.
 * Which cells light up and when is derived from the index, so the pattern is
 * stable between server and client renders.
 */
export default function AnimatedGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-[-25%] z-0 skew-y-8 overflow-hidden opacity-45 [mask-image:radial-gradient(ellipse_55%_48%_at_50%_34%,black,transparent_82%)]"
    >
      <div className="grid h-[150%] grid-cols-[repeat(18,1fr)] border-t border-l border-grid-line">
        {cells.map((index) => (
          <span
            key={index}
            style={{ animationDelay: `${(index % 19) * 0.31}s` }}
            className={`min-h-12 min-w-12 border-r border-b border-grid-line ${
              (index * 17) % 31 < 5 ? "motion-safe:animate-grid-pulse" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
