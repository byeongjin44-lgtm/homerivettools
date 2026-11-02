import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { toolMetadata } from "@/lib/page-metadata";
import { TOOLS } from "@/lib/site-config";

type Props = { params: Promise<{ calculator: string }> };

// Static export: one page per calculator in the registry, nothing else.
export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ calculator: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { calculator } = await params;
  const tool = TOOLS.find((t) => t.slug === calculator);
  return tool ? toolMetadata(tool) : {};
}

export default async function CalculatorPage({ params }: Props) {
  const { calculator } = await params;
  const tool = TOOLS.find((t) => t.slug === calculator);
  if (!tool) notFound();
  return <ToolPageLayout tool={tool} />;
}
