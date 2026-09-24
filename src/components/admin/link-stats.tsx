import { fetchLinkStats, type LinkStat } from "@/lib/posthog-query";
import {
  labelClassName,
  tableCellClassName,
  tableHeaderClassName,
} from "./form-styles";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

function StatRow({ stat }: { stat: LinkStat }) {
  return (
    <tr>
      <td className={`${tableCellClassName} font-mono whitespace-nowrap`}>
        /go/{stat.slug}
      </td>
      <td className={tableCellClassName}>{stat.campaign ?? "—"}</td>
      <td className={`${tableCellClassName} tabular-nums`}>{stat.scans}</td>
      <td className={`${tableCellClassName} tabular-nums`}>{stat.clicks}</td>
      <td className={`${tableCellClassName} whitespace-nowrap text-muted`}>
        {formatDate(stat.lastUsed)}
      </td>
      <td className={`${tableCellClassName} tabular-nums text-muted`}>
        {stat.knownVisitors}/{stat.total}
      </td>
    </tr>
  );
}

// Reads production link_click events straight from PostHog rather than
// keeping a counter here — one source of truth, so these numbers always agree
// with the dashboard. Bot-filtering already happened at capture time.
export default async function LinkStats() {
  const result = await fetchLinkStats();

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col text-left">
      <p className={labelClassName}>
        Link and QR usage — production only, scans counted separately from
        clicks
      </p>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface-solid">
        <table className="w-full border-collapse text-[.8rem]">
          <thead>
            <tr>
              <th className={tableHeaderClassName}>Link</th>
              <th className={tableHeaderClassName}>Campaign</th>
              <th className={tableHeaderClassName}>Scans</th>
              <th className={tableHeaderClassName}>Clicks</th>
              <th className={tableHeaderClassName}>Last used</th>
              <th className={tableHeaderClassName}>Known</th>
            </tr>
          </thead>
          <tbody>
            {!result.ok ? (
              <tr>
                <td className={`${tableCellClassName} text-muted`} colSpan={6}>
                  {result.error}
                </td>
              </tr>
            ) : result.stats.length === 0 ? (
              <tr>
                <td className={`${tableCellClassName} text-muted`} colSpan={6}>
                  No clicks or scans recorded yet.
                </td>
              </tr>
            ) : (
              result.stats.map((stat) => (
                <StatRow key={`${stat.slug}:${stat.campaign ?? ""}`} stat={stat} />
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[.7rem] text-muted">
        &ldquo;Known&rdquo; counts clicks from a device that had been to the
        site before, out of the total — a shared or forwarded link tends to
        show up as unknown.
      </p>
    </div>
  );
}
