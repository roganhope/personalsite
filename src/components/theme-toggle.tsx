"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import posthog from "posthog-js";
import { MonitorIcon, MoonIcon, SunIcon } from "./icons";

export const THEME_STORAGE_KEY = "theme";

type Theme = "system" | "light" | "dark";

const OPTIONS = [
  { value: "system", label: "System", Icon: MonitorIcon },
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
] as const satisfies readonly { value: Theme; label: string; Icon: () => React.ReactElement }[];

const DARK_QUERY = "(prefers-color-scheme: dark)";

/** Mirrors the pre-paint script in `app/layout.tsx` — keep the two in step. */
function resolveTheme(theme: Theme) {
  const dark = theme === "dark" || (theme !== "light" && window.matchMedia(DARK_QUERY).matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); fall through.
  }
  return "system";
}

/*
 * The preference lives in localStorage rather than React state: the pre-paint
 * script reads it before React exists, and another tab can change it. A tiny
 * external store keeps `useSyncExternalStore` as the single source of truth,
 * with `getServerSnapshot` supplying the default the server rendered.
 */
const listeners = new Set<() => void>();
let snapshot: Theme | null = null;

function notify() {
  for (const listener of listeners) listener();
}

function handleStorage(event: StorageEvent) {
  if (event.key !== THEME_STORAGE_KEY) return;
  snapshot = readStoredTheme();
  resolveTheme(snapshot);
  notify();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", handleStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot(): Theme {
  // Cached so repeat calls return a referentially stable value.
  if (snapshot === null) snapshot = readStoredTheme();
  return snapshot;
}

function getServerSnapshot(): Theme {
  return "system";
}

function storeTheme(next: Theme) {
  snapshot = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Preference just won't persist; the page still switches.
  }
  resolveTheme(next);
  notify();
}

/**
 * Three-way theme switch. The pre-paint script has already applied the stored
 * preference by the time this hydrates, so the only job here is to reflect it
 * and to write changes back.
 */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // While following the system, track the OS flipping mid-session.
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia(DARK_QUERY);
    const handleChange = () => resolveTheme("system");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  const choose = useCallback((next: Theme) => {
    storeTheme(next);
    posthog.capture("theme_changed", { theme: next });
  }, []);

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-footer-ink/20 p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => choose(value)}
            aria-pressed={selected}
            title={`${label} theme`}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-150 ${
              selected ? "bg-pink text-on-accent" : "text-footer-ink/65 hover:text-footer-ink"
            }`}
          >
            <Icon />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
