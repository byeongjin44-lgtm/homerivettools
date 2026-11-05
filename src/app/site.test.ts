import { describe, expect, it } from "vitest";
import { ADSENSE_CLIENT, SITE_URL, TOOLS, TOOL_CATEGORIES, adsTxt } from "@/lib/site-config";
import { CALCULATORS } from "@/lib/calc/registry";
import { CALCULATOR_CONTENT } from "@/lib/calculator-content";
import { findForbiddenTopics } from "@/lib/content-policy";
import { ogImageKey, ogImagePath } from "@/lib/og";
import { pageMetadata } from "@/lib/page-metadata";
import sitemap from "./sitemap";
import robots from "./robots";
import { generateStaticParams } from "./[calculator]/page";

describe("site", () => {
  it("has exactly one tool page, one calculator and one content entry per slug", () => {
    const slugs = TOOLS.map((t) => t.slug).sort();
    expect(slugs).toHaveLength(10);
    expect(CALCULATORS.map((c) => c.slug).sort()).toEqual(slugs);
    expect(Object.keys(CALCULATOR_CONTENT).sort()).toEqual(slugs);
    expect(generateStaticParams().map((p) => p.calculator).sort()).toEqual(slugs);
  });

  it("cites https sources for every calculator", () => {
    for (const t of TOOLS) {
      expect(t.sources.length, t.slug).toBeGreaterThan(0);
      for (const s of t.sources) expect(s.url).toMatch(/^https:\/\//);
    }
  });

  it("uses valid categories and related slugs", () => {
    for (const t of TOOLS) {
      expect(TOOL_CATEGORIES).toContain(t.category);
      for (const r of t.related) expect(TOOLS.map((x) => x.slug)).toContain(r);
    }
  });

  it("lists every page in the sitemap", () => {
    const urls = sitemap().map((e) => e.url);
    for (const t of TOOLS) expect(urls).toContain(`${SITE_URL}${t.path}`);
    expect(urls).toContain(`${SITE_URL}/blog`);
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it("serves ads.txt for the configured publisher", () => {
    expect(adsTxt()).toBe(`google.com, ${ADSENSE_CLIENT!.replace("ca-", "")}, DIRECT, f08c47fec0942fa0\n`);
  });

  it("keeps calculator page text within the content policy", () => {
    for (const [slug, c] of Object.entries(CALCULATOR_CONTENT)) {
      const text = [...c.howItWorks, ...c.tips, ...c.faq.flatMap((f) => [f.q, f.a]), c.scope ?? ""].join("\n");
      expect(findForbiddenTopics(text), slug).toEqual([]);
    }
  });
});

describe("share-preview images", () => {
  it("gives the homepage, each calculator and each post its own image; other pages share the homepage one", () => {
    expect(ogImageKey("/")).toBe("home");
    expect(ogImageKey("/about")).toBe("home");
    expect(ogImageKey("/blog")).toBe("home");
    expect(ogImageKey("/blog/how-much-paint")).toBe("blog-how-much-paint");
    for (const t of TOOLS) expect(ogImageKey(t.path)).toBe(t.slug);
  });

  it("puts an absolute 1200x630 image into Open Graph and Twitter metadata", () => {
    const meta = pageMetadata({ title: "T", description: "D", path: "/paint-calculator" });
    const og = meta.openGraph?.images as { url: string; width: number; height: number }[];
    expect(og[0]).toMatchObject({ url: `${SITE_URL}${ogImagePath("/paint-calculator")}`, width: 1200, height: 630 });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
