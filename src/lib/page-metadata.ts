import type { Metadata } from "next";
import { OG_SIZE, ogImagePath } from "@/lib/og";
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
 * Every page gets a share-preview image (see `src/lib/og.ts`).
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = { url: `${SITE_URL}${ogImagePath(path)}`, ...OG_SIZE, alt: title };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type: "website", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export function toolMetadata(tool: ToolDefinition): Metadata {
  return pageMetadata({ title: tool.title, description: tool.metaDescription, path: tool.path });
}
