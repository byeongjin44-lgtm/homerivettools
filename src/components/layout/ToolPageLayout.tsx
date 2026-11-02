import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { CalculatorTool } from "@/components/CalculatorTool";
import { SITE_URL, getRelatedTools, type ToolDefinition } from "@/lib/site-config";
import { blogPath, getPostsForTool } from "@/lib/blog";
import { CALCULATOR_CONTENT } from "@/lib/calculator-content";
import { INSULATION_R_PER_INCH_REFERENCE } from "@/lib/calc/formulas";
import { defaultValues, formatNumber, getCalculator, isFieldActive } from "@/lib/calc/registry";

const H2 = "mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50";
const LINK = "font-medium text-zinc-900 underline dark:text-zinc-50";

export function ToolPageLayout({ tool }: { tool: ToolDefinition }) {
  const content = CALCULATOR_CONTENT[tool.slug];
  const calc = getCalculator(tool.slug);
  const example = defaultValues(calc);
  const exampleRows = calc.compute(example);
  const relatedTools = getRelatedTools(tool.path);
  const guides = getPostsForTool(tool.slug);

  return (
    <Container className="flex flex-1 flex-col gap-8 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          description: tool.metaDescription,
          url: `${SITE_URL}${tool.path}`,
          applicationCategory: "UtilitiesApplication",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">{tool.name}</h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">{tool.shortDescription}</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <CalculatorTool slug={tool.slug} />
      </div>

      <AdSlot id="tool-bottom" />

      <article className="flex max-w-3xl flex-col gap-6 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className={H2}>How the calculation works</h2>
          <ol className="flex list-decimal flex-col gap-1 pl-5">
            {content.howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className={H2}>Example</h2>
          <p>
            {calc.fields
              .filter((f) => isFieldActive(f, example))
              .map((f) => {
                if (f.kind === "select") return `${f.label}: ${f.options.find((o) => o.value === f.default)?.label}`;
                return `${f.label}: ${formatNumber(f.default, 4)}${f.unit ? ` ${f.unit}` : ""}`;
              })
              .join(" · ")}
          </p>
          <p className="mt-2">
            Result:{" "}
            {exampleRows
              .filter((r) => r.primary)
              .map((r) => `${formatNumber(r.value, r.digits)} ${r.unit}`)
              .join(" or ")}
            .
          </p>
        </section>

        {tool.slug === "insulation-calculator" && (
          <section>
            <h2 className={H2}>Approximate R-value per inch</h2>
            <table className="w-full max-w-lg text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-1 font-medium">Material</th>
                  <th className="py-1 font-medium">R-value per inch</th>
                </tr>
              </thead>
              <tbody>
                {INSULATION_R_PER_INCH_REFERENCE.map((m) => (
                  <tr key={m.material} className="border-b border-zinc-100 dark:border-zinc-800/60">
                    <td className="py-1">{m.material}</td>
                    <td className="py-1">{m.low === m.high ? `about ${m.low}` : `about ${m.low}–${m.high}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Derived from the R-values and thicknesses in the U.S. Department of Energy guide. Use your product&apos;s label.
            </p>
          </section>
        )}

        <section>
          <h2 className={H2}>Tips before you buy</h2>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {content.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
            <li>Always confirm coverage and yield with the manufacturer&apos;s label — products differ.</li>
            {content.scope && <li>{content.scope}</li>}
          </ul>
        </section>

        <section>
          <h2 className={H2}>FAQ</h2>
          <div className="flex flex-col gap-3">
            {content.faq.map((item) => (
              <div key={item.q}>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{item.q}</p>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {tool.sources.length > 0 && (
          <section>
            <h2 className={H2}>Sources</h2>
            <ul className="flex list-disc flex-col gap-1 pl-5">
              {tool.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} className={LINK} rel="noopener noreferrer" target="_blank">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {guides.length > 0 && (
        <nav aria-labelledby="related-guides" className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <h2 id="related-guides" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Guides
          </h2>
          <ul className="flex flex-col gap-1">
            {guides.map((post) => (
              <li key={post.slug}>
                <Link href={blogPath(post.slug)} className={LINK}>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {relatedTools.length > 0 && (
        <nav aria-labelledby="related-tools" className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <h2 id="related-tools" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Related calculators
          </h2>
          <ul className="flex flex-col gap-1">
            {relatedTools.map((related) => (
              <li key={related.slug}>
                <Link href={related.path} className={LINK}>
                  {related.name}
                </Link>{" "}
                — {related.shortDescription}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </Container>
  );
}
