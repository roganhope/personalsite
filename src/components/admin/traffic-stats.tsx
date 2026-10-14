import {
  fetchTrafficTiles,
  type TrafficSeries,
  type TrafficTile,
} from "@/lib/posthog-traffic";
import { labelClassName } from "./form-styles";

const LINE_COLORS = [
  "var(--color-pink)",
  "var(--color-ink)",
  "var(--color-pink-soft)",
  "var(--color-muted)",
  "var(--color-line-strong)",
];

const WIDTH = 640;
const HEIGHT = 180;
const PAD = { top: 10, right: 10, bottom: 22, left: 30 };

function shortDay(day: string) {
  const date = new Date(day);
  return Number.isNaN(date.getTime())
    ? day
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
}

type ChartKind = "line" | "bar";

function Chart({ series, kind }: { series: TrafficSeries[]; kind: ChartKind }) {
  const days = series[0]?.days ?? [];
  const max = Math.max(1, ...series.flatMap((s) => s.data));
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;

  // Lines put each day on a point; bars give each day an equal band and
  // centre the day's group of bars (one per series) inside it.
  const band = plotWidth / Math.max(1, days.length);
  const barWidth = (band * 0.8) / Math.max(1, series.length);
  const x = (i: number) =>
    kind === "bar"
      ? PAD.left + (i + 0.5) * band
      : PAD.left + (days.length > 1 ? (i / (days.length - 1)) * plotWidth : 0);
  const y = (value: number) => PAD.top + plotHeight - (value / max) * plotHeight;
  const baseline = y(0);

  return (
    <div className="p-4">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={series.map((s) => s.label).join(", ")}
      >
        {[0, 0.5, 1].map((fraction) => (
          <g key={fraction}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y(max * fraction)}
              y2={y(max * fraction)}
              stroke="var(--color-line)"
            />
            <text
              x={PAD.left - 6}
              y={y(max * fraction) + 3}
              textAnchor="end"
              fontSize="9"
              fill="var(--color-muted)"
            >
              {Math.round(max * fraction)}
            </text>
          </g>
        ))}
        {kind === "bar"
          ? series.map((s, index) => (
              <g key={s.label} fill={LINE_COLORS[index % LINE_COLORS.length]}>
                {s.data.map((value, i) =>
                  value > 0 ? (
                    <rect
                      key={i}
                      x={x(i) - (barWidth * series.length) / 2 + index * barWidth}
                      y={y(value)}
                      width={barWidth}
                      height={baseline - y(value)}
                    >
                      <title>{`${shortDay(days[i])} · ${s.label}: ${value}`}</title>
                    </rect>
                  ) : null,
                )}
              </g>
            ))
          : series.map((s, index) => (
              <polyline
                key={s.label}
                fill="none"
                stroke={LINE_COLORS[index % LINE_COLORS.length]}
                strokeWidth="2"
                strokeLinejoin="round"
                points={s.data.map((value, i) => `${x(i)},${y(value)}`).join(" ")}
              />
            ))}
        {days.length > 0 && (
          <>
            <text
              x={x(0)}
              y={HEIGHT - 6}
              textAnchor={kind === "bar" ? "middle" : "start"}
              fontSize="9"
              fill="var(--color-muted)"
            >
              {shortDay(days[0])}
            </text>
            <text
              x={x(days.length - 1)}
              y={HEIGHT - 6}
              textAnchor={kind === "bar" ? "middle" : "end"}
              fontSize="9"
              fill="var(--color-muted)"
            >
              {shortDay(days[days.length - 1])}
            </text>
          </>
        )}
      </svg>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[.75rem]">
        {series.map((s, index) => (
          <li key={s.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: LINE_COLORS[index % LINE_COLORS.length] }}
            />
            {s.label}
            <span className="tabular-nums text-muted">{s.total}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tile({
  title,
  note,
  tile,
  chart,
}: {
  title: string;
  note: string;
  tile: TrafficTile;
  chart: ChartKind;
}) {
  return (
    <div>
      <p className={labelClassName}>{title}</p>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface-solid">
        {!tile.ok ? (
          <p className="px-4 py-3 text-[.8rem] text-muted">{tile.error}</p>
        ) : tile.series.length === 0 ? (
          <p className="px-4 py-3 text-[.8rem] text-muted">No visits yet.</p>
        ) : (
          <Chart series={tile.series} kind={chart} />
        )}
      </div>
      <p className="mt-2 text-[.7rem] text-muted">{note}</p>
    </div>
  );
}

// Two charts copied from the "Campaign & Traffic Tracking" PostHog dashboard.
// Same queries, same test-account filter, so these agree with the dashboard.
export default async function TrafficStats() {
  const tiles = await fetchTrafficTiles();

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-8 text-left">
      <Tile
        title="Visitor activity (30 days)"
        note="Daily unique visitors and pageviews. Excludes internal and family traffic."
        tile={tiles.activity}
        chart="line"
      />
      <Tile
        title="Visitors over time by UTM source (30 days)"
        note="Daily unique visitors per utm_source."
        tile={tiles.utmOverTime}
        chart="bar"
      />
    </div>
  );
}
