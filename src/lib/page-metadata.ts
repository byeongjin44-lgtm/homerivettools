import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, type ToolDefinition } from "@/lib/site-config";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Route path starting with "/", e.g. "/base64" or "/" for the homepage. */
  path: string;
};

/**
 * Title, description, self-referencing canonical and a complete Open Graph block for one page.
 * A page's `openGraph` replaces the root layout's, so site name and type are set here too.
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type: "website" },
  };
}

export function toolMetadata(tool: ToolDefinition): Metadata {
  return pageMetadata({ title: tool.title, description: tool.metaDescription, path: tool.path });
}
