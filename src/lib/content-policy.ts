/**
 * Content risk policy — LOCKED. Do not remove, loosen or bypass any rule here without the site
 * owner's explicit approval (CLAUDE.md). `content-policy.test.ts` fails if a rule is removed.
 *
 * HomeRivet covers material quantity estimates only. Posts must never give instructions on
 * electrical work, structural design or loads, gas, roofing or other work-at-height, hazardous
 * materials, or building-code interpretation. Any match below rejects the post at build time
 * (and the blog engine runs the same check before a post reaches the approval step).
 */
export const FORBIDDEN_TOPICS: Record<string, string[]> = {
  electrical: ["wiring", "rewire", "circuit breaker", "electrical panel", "breaker box", "outlet installation", "install an outlet", "light fixture installation"],
  structural: ["load-bearing", "load bearing", "load calculation", "span table", "joist span", "joist sizing", "beam size", "beam sizing", "footing size", "footing design", "post size", "structural design"],
  gas: ["gas line", "gas pipe", "gas appliance installation"],
  roofing: ["roofing", "roof repair", "shingle installation", "ladder safety"],
  plumbing: ["plumbing installation", "pipe sweating", "drain line installation"],
  hazardous: ["asbestos", "lead paint", "lead-based paint", "mold remediation", "mold removal"],
  codes: ["building code", "code requirement", "permit requirement"],
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const PATTERNS = Object.entries(FORBIDDEN_TOPICS).flatMap(([topic, phrases]) =>
  phrases.map((phrase) => ({ topic, phrase, re: new RegExp(`\\b${escapeRe(phrase).replace(/[ -]/g, "[\\s-]+")}\\b`, "i") })),
);

/** Forbidden phrases found in `text`, as "topic: phrase". */
export function findForbiddenTopics(text: string): string[] {
  return PATTERNS.filter((p) => p.re.test(text)).map((p) => `${p.topic}: ${p.phrase}`);
}

/** Every post must point readers back to the product label. */
export const MANUFACTURER_NOTE_RE = /manufacturer|product label|on the (?:bag|box|can|package|label)/i;
