import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME, TOOLS } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `About — ${SITE_NAME}`,
  description: `About ${SITE_NAME}, ${TOOLS.length} free material calculators for home and garden projects.`,
  path: "/about",
});

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
            <Link href={tool.path} className="font-medium text-zinc-900 underline dark:text-zinc-50">
              {tool.name}
            </Link>{" "}
            — {tool.shortDescription}
          </li>
        ))}
      </ul>
      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">How we calculate</h2>
      <p>
        Every calculator uses a fixed formula whose figures come from manufacturer data sheets or public
        agencies such as university extension services and the U.S. Department of Energy. Each page explains the
        formula step by step and links to its sources. The numbers in our guides are produced by the same code
        as the calculators.
      </p>
      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">What we do not cover</h2>
      <p>
        We only estimate material quantities. We do not give advice on electrical work, gas, structural design,
        roofing or other work that needs a licensed professional. Results are estimates — always check the
        coverage or yield printed on the product you buy.
      </p>
    </Container>
  );
}
