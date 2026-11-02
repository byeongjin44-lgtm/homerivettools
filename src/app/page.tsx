import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, TOOLS, TOOL_GROUPS } from "@/lib/site-config";

export const metadata = pageMetadata({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" });

export default function Home() {
  return (
    <Container className="flex flex-1 flex-col gap-10 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
        }}
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Free material calculators for home and garden projects
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          {SITE_NAME} has {TOOLS.length} calculators that tell you how much paint, concrete, tile, flooring,
          mulch, wallpaper, gravel, deck boards and insulation to buy. Every formula is based on manufacturer
          or public-agency figures, cited on each page. No sign-up required.
        </p>
      </div>
      {TOOL_GROUPS.map((group) => (
        <section key={group.category} className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            {group.category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </Container>
  );
}
