# Generating tracked links for hoperogan.com

Use these two base URLs — never link github.com or linkedin.com directly:

- GitHub:   https://hoperogan.com/go/github
- LinkedIn: https://hoperogan.com/go/linkedin

Add two query params to every link:

- `s` — the source: where the link is being placed. Use a short, stable,
  lowercase slug reused across applications, e.g. `resume`, `coverletter`,
  `email`, `portfolio`.
- `c` — the campaign: which application this is, one distinct value per
  company/role. Lowercase, hyphen-separated, no spaces, e.g.
  `pogo-full-stack`, `acme-staff-eng`.

Examples:

    https://hoperogan.com/go/github?s=resume&c=pogo-full-stack
    https://hoperogan.com/go/linkedin?s=resume&c=pogo-full-stack

Rules:

- Both links in a single application MUST share the same `c` value, so the
  GitHub and LinkedIn clicks roll up to one application.
- Keep `c` values unique per application — that's what makes them
  distinguishable later.
- Use only `[a-z0-9-]` in both values. Backticks and whitespace get stripped
  server-side and values are capped at 100 characters.
- Do NOT wrap the URL in markdown backticks or a code fence when handing it
  over — a stray trailing backtick has previously ended up captured as part
  of the value.
- `utm_source` / `utm_campaign` are accepted aliases if the long form reads
  better, but prefer `s` / `c` for print.
- Both params are optional; omitting them still redirects correctly, it just
  records nothing useful.

## Where the data lands

Each click captures a `link_click` event in PostHog with `slug`, `source`,
`campaign`, and `referrer` properties. Break down by `campaign` to compare
applications. Implementation: `src/app/go/[slug]/route.ts`.
