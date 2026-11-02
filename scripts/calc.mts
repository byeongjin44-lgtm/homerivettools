/**
 * Command-line access to the calculators for the blog engine (blog-engine repo, sites/homerivet).
 * The engine runs this BEFORE asking the AI to write, and gives the AI only these numbers;
 * the site build then re-checks every number in the post (see `calculations` in src/lib/blog.ts).
 *
 *   node scripts/calc.mts '{"calculator":"paint-calculator","input":{"lengthFt":12}}'
 *   echo '[{"calculator":"tile-calculator"}]' | node scripts/calc.mts
 *   node scripts/calc.mts --list        # calculators and their input fields
 *
 * Output: JSON. One request → { calculator, input, results }; an array → an array of those.
 * Each result row carries `number` (the exact number text the post must contain for primary rows)
 * and `display` (number + unit, as the page shows it).
 * Exit code 1 with { error } on invalid input.
 */
import { readFileSync } from "node:fs";
import { CALCULATORS, formatNumber, runCalculator } from "../src/lib/calc/registry.ts";

type Request = { calculator: string; input?: Record<string, unknown> };

function run(req: Request) {
  const results = runCalculator(req.calculator, req.input ?? {}).map((r) => ({
    ...r,
    number: formatNumber(r.value, r.digits),
    display: `${formatNumber(r.value, r.digits)} ${r.unit}`,
  }));
  return { calculator: req.calculator, input: req.input ?? {}, results };
}

const arg = process.argv[2];
try {
  if (arg === "--list") {
    // Fields with their defaults and option labels. The engine treats the numbers in them as known
    // values when it checks a draft for decimals the calculator did not produce.
    console.log(JSON.stringify(CALCULATORS.map((c) => ({ calculator: c.slug, fields: c.fields })), null, 2));
  } else {
    const text = arg ?? readFileSync(0, "utf8");
    const parsed = JSON.parse(text) as Request | Request[];
    console.log(JSON.stringify(Array.isArray(parsed) ? parsed.map(run) : run(parsed), null, 2));
  }
} catch (e) {
  console.log(JSON.stringify({ error: (e as Error).message }));
  process.exit(1);
}
