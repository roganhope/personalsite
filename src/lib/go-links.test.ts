import { describe, expect, test } from "vitest";
import { isRetired, type RetiredCode } from "./go-links";

// The retirement list is passed in rather than read from the module, so these
// cover the matching rules without depending on what happens to be retired.
const codes: RetiredCode[] = [
  { slug: "maiscribe" },
  { slug: "github", campaign: "acme-staff-eng" },
];

describe("isRetired", () => {
  test("a slug-only entry retires every campaign for that slug", () => {
    expect(isRetired("maiscribe", null, codes)).toBe(true);
    expect(isRetired("maiscribe", "pogo-full-stack", codes)).toBe(true);
  });

  test("a slug+campaign entry retires only that pair", () => {
    expect(isRetired("github", "acme-staff-eng", codes)).toBe(true);
  });

  test("a slug+campaign entry leaves the rest of the slug alive", () => {
    expect(isRetired("github", null, codes)).toBe(false);
    expect(isRetired("github", "pogo-full-stack", codes)).toBe(false);
  });

  test("an unlisted slug is never retired", () => {
    expect(isRetired("linkedin", "acme-staff-eng", codes)).toBe(false);
  });

  test("an empty list retires nothing", () => {
    expect(isRetired("maiscribe", null, [])).toBe(false);
  });
});
