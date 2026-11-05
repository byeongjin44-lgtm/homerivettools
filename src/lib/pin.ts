import type { BlogPost } from "@/lib/blog";
import { formatNumber, getCalculator, runCalculator, type ResultRow } from "@/lib/calc/registry";

/** Size of the tall Pinterest images (2:3, Pinterest's recommended ratio). */
export const PIN_SIZE = { width: 1000, height: 1500 } as const;

/** Pinterest images exist for every calculator and every published guide. */
export const pinImagePath = (key: string) => `/pin/${key}.png`;

const display = (r: ResultRow) => `${formatNumber(r.value, r.digits)} ${r.unit}`;

/**
 * The headline answers of a guide, straight from the calculator code (the same numbers the build
 * checks in the post text). When a guide compares several inputs (80 lb vs 60 lb bags, one vs two
 * coats), each line names the input that differs.
 */
export function pinAnswers(post: Pick<BlogPost, "calculations">): string[] {
  const calcs = post.calculations ?? [];
  const differing = (key: string) => new Set(calcs.map((c) => String(c.input[key] ?? ""))).size > 1;
  const lines: string[] = [];
  for (const c of calcs) {
    const fields = getCalculator(c.calculator).fields;
    const qualifier = calcs.length > 1
      ? Object.keys(c.input)
          .filter(differing)
          .map((key) => {
            const field = fields.find((f) => f.key === key);
            if (!field) return "";
            if (field.kind === "select") {
              const label = field.options.find((o) => o.value === String(c.input[key]))?.label ?? String(c.input[key]);
              return `${field.label}: ${label.replace(/\s*\(.*\)\s*$/, "")}`;
            }
            return `${field.label}: ${c.input[key]}${field.unit ? ` ${field.unit}` : ""}`;
          })
          .filter(Boolean)
          .join(", ")
      : "";
    const answer = runCalculator(c.calculator, c.input)
      .filter((r) => r.primary)
      .map(display)
      .join(" · ");
    lines.push(qualifier ? `${answer} (${qualifier})` : answer);
  }
  return lines.slice(0, 3);
}

