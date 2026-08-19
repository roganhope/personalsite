"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";
import { destinations, sources } from "@/lib/go-links";
import CopyButton from "./copy-button";
import {
  generateLinks,
  type GenerateState,
} from "@/app/secret/admin/actions";
import {
  fieldClassName,
  labelClassName,
  submitClassName,
  tableCellClassName,
  tableHeaderClassName,
} from "./form-styles";

type HistoryEntry = {
  slug: string;
  source: string | null;
  campaign: string | null;
  readable: string;
  sneaky: string;
  mintedAt: string;
};

const HISTORY_KEY = "go-link-history";
const HISTORY_EVENT = "go-link-history-change";
const HISTORY_CAP = 50;

// Convenience only — the links themselves are stateless, so losing this
// history loses nothing but the list. Kept in localStorage and read through
// useSyncExternalStore so the server render (empty) and updates stay in sync.
function subscribeToHistory(onChange: () => void) {
  window.addEventListener(HISTORY_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(HISTORY_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function historySnapshot() {
  try {
    return localStorage.getItem(HISTORY_KEY) ?? "";
  } catch {
    return "";
  }
}

function parseHistory(raw: string): HistoryEntry[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch {
    // Storage full or unavailable; the generator still works.
  }
}

function LinkRow({ label, url }: { label: string; url: string }) {
  return (
    <div>
      <p className={labelClassName}>{label}</p>
      <div className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3">
        <code className="min-w-0 flex-1 text-left font-mono text-[.75rem] break-all text-ink">
          {url}
        </code>
        <CopyButton value={url} />
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${submitClassName} self-end`}
    >
      {pending ? "Minting…" : "Generate links"}
    </button>
  );
}

export default function LinkGenerator() {
  const [result, setResult] = useState<GenerateState>({});
  const [customSource, setCustomSource] = useState(false);

  const rawHistory = useSyncExternalStore(
    subscribeToHistory,
    historySnapshot,
    () => ""
  );
  const history = useMemo(() => parseHistory(rawHistory), [rawHistory]);

  async function submitAction(formData: FormData) {
    const next = await generateLinks({}, formData);
    setResult(next);

    if (next.readable && next.sneaky && next.slug) {
      writeHistory(
        [
          {
            slug: next.slug,
            source: next.source ?? null,
            campaign: next.campaign ?? null,
            readable: next.readable,
            sneaky: next.sneaky,
            mintedAt: new Date().toISOString(),
          },
          ...history,
        ].slice(0, HISTORY_CAP)
      );
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-10 text-left">
      <form
        action={submitAction}
        className="mx-auto flex w-full max-w-[560px] flex-col gap-5"
      >
        <div>
          <label htmlFor="destination" className={labelClassName}>
            Destination
          </label>
          <select
            id="destination"
            name="destination"
            defaultValue="site"
            className={fieldClassName}
          >
            {Object.entries(destinations)
              .filter(([, entry]) => !entry.legacy)
              .map(([slug]) => (
                <option key={slug} value={slug}>
                  {slug === "site" ? "hoperogan.com" : slug}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="source" className={labelClassName}>
            Source
          </label>
          <select
            id="source"
            name="source"
            className={fieldClassName}
            onChange={(event) => setCustomSource(event.target.value === "custom")}
          >
            <option value="">(none)</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
            <option value="custom">custom…</option>
          </select>
        </div>
        {customSource && (
          <div>
            <label htmlFor="sourceCustom" className={labelClassName}>
              Custom source
            </label>
            <input
              type="text"
              id="sourceCustom"
              name="sourceCustom"
              placeholder="linkedinchat"
              className={fieldClassName}
            />
          </div>
        )}
        <div>
          <label htmlFor="campaign" className={labelClassName}>
            Campaign (person, application…)
          </label>
          <input
            type="text"
            id="campaign"
            name="campaign"
            placeholder="jane-doe-acme"
            className={fieldClassName}
          />
        </div>
        {result.error && (
          <p className="text-[.75rem] text-pink">{result.error}</p>
        )}
        <SubmitButton />
      </form>

      {result.readable && result.sneaky && (
        <div className="mx-auto flex w-full max-w-[560px] flex-col gap-5">
          <LinkRow label="Readable" url={result.readable} />
          <LinkRow label="Sneaky" url={result.sneaky} />
        </div>
      )}

      {history.length > 0 && (
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <p className={`${labelClassName} mb-0`}>
              Minted campaign links — this browser only, there&apos;s no server
              record
            </p>
            <button
              type="button"
              onClick={() => writeHistory([])}
              className="text-[.7rem] text-muted underline-offset-2 hover:text-pink hover:underline"
            >
              clear
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-line bg-white">
            <table className="w-full border-collapse text-[.8rem]">
              <thead>
                <tr>
                  <th className={tableHeaderClassName}>Campaign</th>
                  <th className={tableHeaderClassName}>Source</th>
                  <th className={tableHeaderClassName}>Link</th>
                  <th className={tableHeaderClassName}>Minted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.mintedAt + entry.sneaky}>
                    <td className={tableCellClassName}>
                      {entry.campaign ?? "—"}
                    </td>
                    <td className={tableCellClassName}>
                      {entry.source ?? "—"}
                    </td>
                    <td className={`${tableCellClassName} font-mono whitespace-nowrap`}>
                      /go/{entry.slug}
                    </td>
                    <td className={`${tableCellClassName} text-muted whitespace-nowrap`}>
                      {new Date(entry.mintedAt).toLocaleDateString()}
                    </td>
                    <td className={`${tableCellClassName} w-0`}>
                      <div className="flex items-center gap-2">
                        <CopyButton value={entry.readable} />
                        <span className="text-[.7rem] text-muted">readable</span>
                        <CopyButton value={entry.sneaky} />
                        <span className="text-[.7rem] text-muted">sneaky</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
