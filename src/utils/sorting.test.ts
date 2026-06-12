import { describe, expect, it } from "vitest";
import { sortByOpprettet, type UtkastElement } from "./sorting";

const makeUtkast = (
  opprettet: string,
  overrides: Partial<UtkastElement> = {},
): UtkastElement => ({
  tittel: "Utkast",
  link: "https://nav.no/utkast",
  utkastId: opprettet,
  opprettet,
  sistEndret: opprettet,
  ...overrides,
});

describe("sortByOpprettet", () => {
  it("should sort the most recently created draft first", () => {
    const eldst = makeUtkast("2024-01-01T10:00:00.000Z");
    const nyest = makeUtkast("2024-03-01T10:00:00.000Z");
    const midt = makeUtkast("2024-02-01T10:00:00.000Z");

    const sorted = [eldst, nyest, midt].sort(sortByOpprettet);

    expect(sorted.map((u) => u.opprettet)).toEqual([
      nyest.opprettet,
      midt.opprettet,
      eldst.opprettet,
    ]);
  });

  it("should return -1 when the first draft is created after the second", () => {
    const a = makeUtkast("2024-05-01T10:00:00.000Z");
    const b = makeUtkast("2024-01-01T10:00:00.000Z");

    expect(sortByOpprettet(a, b)).toBe(-1);
  });

  it("should return 1 when the first draft is created before the second", () => {
    const a = makeUtkast("2024-01-01T10:00:00.000Z");
    const b = makeUtkast("2024-05-01T10:00:00.000Z");

    expect(sortByOpprettet(a, b)).toBe(1);
  });
});
