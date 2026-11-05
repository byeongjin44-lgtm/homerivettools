import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/lib/page-metadata";
import { CONTACT_EMAIL, SITE_NAME, TOOLS } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `About — ${SITE_NAME}`,
  description: `About ${SITE_NAME}: ${TOOLS.length} free material calculators for home and garden projects, how they calculate, and how to report a mistake.`,
  path: "/about",
});

const linkClass = "font-medium text-zinc-900 underline dark:text-zinc-50";
const h2Class = "mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50";

export default function AboutPage() {
  return (
    <Container className="flex flex-1 flex-col gap-4 py-12 text-zinc-700 dark:text-zinc-300">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">About {SITE_NAME}</h1>
      <p>
        {SITE_NAME} answers one question for home and garden projects: how much material should I buy? It has{" "}
        {TOOLS.length} free calculators:
      </p>
      <ul className="list-disc pl-5">
        {TOOLS.map((tool) => (
          <li key={tool.slug}>
            <Link href={tool.path} className={linkClass}>
              {tool.name}
            </Link>{" "}
            — {tool.shortDescription}
          </li>
        ))}
      </ul>
      <h2 className={h2Class}>How we calculate</h2>
      <p>
        Every calculator uses a fixed formula whose figures come from manufacturer data sheets or public
        agencies such as university extension services and the U.S. Department of Energy. Each page explains the
        formula step by step and links to its sources. The numbers in our guides are produced by the same code
        as the calculators.
      </p>
      <h2 className={h2Class}>Using the calculators</h2>
      <p>
        There is no sign-up and no login. The numbers you enter are calculated by JavaScript in your own browser
        and are not sent to our servers. All calculators use US customary units — feet, inches, gallons, pounds
        and cubic yards — and US package sizes such as 80 lb concrete bags.
      </p>

      <h2 className={h2Class}>Guides</h2>
      <p>
        The{" "}
        <Link href="/blog" className={linkClass}>
          blog
        </Link>{" "}
        publishes short guides for common project sizes, such as how much paint a 12 × 12 room needs. Every
        number in a guide comes from the calculator code, and the site checks those numbers again each time it
        is built, so a guide cannot show a figure the calculator does not produce. Each guide is reviewed before it
        is published, lists its sources and links to the calculator, so you can enter your own measurements.
      </p>

      <h2 className={h2Class}>What we do not cover</h2>
      <p>
        We only estimate material quantities. We do not give advice on electrical work, gas, structural design,
        roofing or other work that needs a licensed professional. Results are estimates — always check the
        coverage or yield printed on the product you buy.
      </p>

      <h2 className={h2Class}>Corrections and feedback</h2>
      <p>
        If you find a mistake in a calculator or a guide, or a project the calculators do not handle well, please
        tell us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
          {CONTACT_EMAIL}
        </a>{" "}
        or through the{" "}
        <Link href="/contact" className={linkClass}>
          contact page
        </Link>
        . We fix confirmed errors, and corrected guides show an &quot;Updated&quot; date.
      </p>
    </Container>
  );
}
