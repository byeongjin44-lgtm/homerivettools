/**
 * Guards the LOCKED content risk policy. These tests must not be deleted or weakened without the
 * site owner's explicit approval (CLAUDE.md).
 */
import { describe, expect, it } from "vitest";
import { FORBIDDEN_TOPICS, MANUFACTURER_NOTE_RE, findForbiddenTopics } from "@/lib/content-policy";

const REQUIRED: Record<string, string[]> = {
  electrical: ["wiring", "circuit breaker", "electrical panel"],
  structural: ["load-bearing", "load calculation", "joist span", "beam size", "footing design"],
  gas: ["gas line", "gas pipe"],
  roofing: ["roofing", "roof repair", "ladder safety"],
  plumbing: ["plumbing installation"],
  hazardous: ["asbestos", "lead paint", "mold removal"],
  codes: ["building code"],
};

describe("content policy", () => {
  it("keeps every required forbidden topic", () => {
    for (const [topic, phrases] of Object.entries(REQUIRED)) {
      expect(FORBIDDEN_TOPICS[topic], topic).toBeDefined();
      for (const phrase of phrases) expect(FORBIDDEN_TOPICS[topic]).toContain(phrase);
    }
  });

  it("detects phrases regardless of case, spaces and hyphens", () => {
    expect(findForbiddenTopics("Check the Circuit  Breaker first")).toEqual(["electrical: circuit breaker"]);
    expect(findForbiddenTopics("a load bearing wall")).toContain("structural: load-bearing");
    expect(findForbiddenTopics("Removing LEAD-PAINT safely")).toContain("hazardous: lead paint");
  });

  it("does not flag ordinary material talk", () => {
    expect(findForbiddenTopics("Buy 3 gallons of paint and 56 bags of concrete mix for the patio.")).toEqual([]);
    expect(findForbiddenTopics("Gaslight and roofline are different words.")).toEqual([]);
  });

  it("recognises a manufacturer note", () => {
    expect(MANUFACTURER_NOTE_RE.test("Always check the coverage printed on the can.")).toBe(true);
    expect(MANUFACTURER_NOTE_RE.test("Follow the manufacturer's instructions.")).toBe(true);
    expect(MANUFACTURER_NOTE_RE.test("Just buy some paint.")).toBe(false);
  });
});
