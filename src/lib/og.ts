import { TOOLS } from "@/lib/site-config";

/** Size of every share-preview (Open Graph) image. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Which preview image a page uses. The homepage, each calculator and each blog post get their own
 * image (built by `src/app/og/[image]/route.tsx`); every other page shares the homepage image.
 */
export function ogImageKey(path: string): string {
  if (path.startsWith("/blog/")) return `blog-${path.slice("/blog/".length)}`;
  const tool = TOOLS.find((t) => t.path === path);
  return tool ? tool.slug : "home";
}

export const ogImagePath = (path: string) => `/og/${ogImageKey(path)}.png`;
