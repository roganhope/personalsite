"use client";

import { useState } from "react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="shrink-0 rounded-full border border-line px-3 py-1.5 text-[.7rem] font-[850] tracking-[.06em] text-muted uppercase transition-colors duration-150 hover:border-pink hover:text-pink"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
