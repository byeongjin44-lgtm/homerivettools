import type { MetadataRoute } from "next";
import { SITE_URL, TOOLS } from "@/lib/site-config";
import { blogPath, getAllPosts } from "@/lib/blog";

// Required by `output: "export"` so sitemap.xml is generated once at build time.
export const dynamic = "force-static";

const STATIC_PATHS = ["/", "/about", "/privacy", "/terms", "/contact", "/blog"];

// No build-time lastModified: a build timestamp would change on every deploy without the content
// changing, which makes lastmod untrustworthy to search engines. Blog posts are the exception —
// they carry real published/updated dates in their content files.
export default function sitemap(): MetadataRoute.Sitemap {
  const toolPaths = TOOLS.map((tool) => tool.path);
  const pages = [...STATIC_PATHS, ...toolPaths].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
  const posts = getAllPosts().map((post) => ({
    url: `${SITE_URL}${blogPath(post.slug)}`,
    lastModified: post.updated ?? post.published,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
