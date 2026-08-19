import { destinations, legacyRoutes } from "@/lib/go-links";
import {
  labelClassName,
  tableCellClassName,
  tableHeaderClassName,
} from "./form-styles";
import CopyButton from "./copy-button";

type Row = { link: string; description: string; url: string; copy: string };

function LinkTable({ label, rows }: { label: string; rows: Row[] }) {
  return (
    <div>
      <p className={labelClassName}>{label}</p>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface-solid">
        <table className="w-full border-collapse text-[.8rem]">
          <thead>
            <tr>
              <th className={tableHeaderClassName}>Link</th>
              <th className={tableHeaderClassName}>Description</th>
              <th className={tableHeaderClassName}>Goes to</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.link}>
                <td className={`${tableCellClassName} font-mono whitespace-nowrap`}>
                  {row.link}
                </td>
                <td className={tableCellClassName}>{row.description}</td>
                <td className={`${tableCellClassName} text-muted break-all`}>
                  {row.url}
                </td>
                <td className={`${tableCellClassName} w-0`}>
                  <CopyButton value={row.copy} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// The full inventory from src/lib/go-links.ts, so the panel doubles as the
// record of what's already out there. Legacy entries stay alive for
// already-shared links but don't belong in new messages.
export default function RegisteredLinks() {
  const entries = Object.entries(destinations);

  const active: Row[] = entries
    .filter(([, entry]) => !entry.legacy)
    .map(([slug, entry]) => ({
      link: `/go/${slug}`,
      description: entry.description,
      url: entry.url,
      copy: `https://hoperogan.com/go/${slug}`,
    }));

  const legacy: Row[] = [
    ...entries
      .filter(([, entry]) => entry.legacy)
      .map(([slug, entry]) => ({
        link: `/go/${slug}`,
        description: entry.description,
        url: entry.url,
        copy: `https://hoperogan.com/go/${slug}`,
      })),
    ...legacyRoutes.map((route) => ({
      link: route.path,
      description: route.description,
      url: route.url,
      copy: `https://hoperogan.com${route.path}`,
    })),
  ];

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-10 text-left">
      <LinkTable label="Registered links" rows={active} />
      {legacy.length > 0 && (
        <LinkTable
          label="Legacy — alive for already-shared links, don't reuse"
          rows={legacy}
        />
      )}
    </div>
  );
}
