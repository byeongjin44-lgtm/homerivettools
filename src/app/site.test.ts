import { describe, expect, it } from "vitest";
import { ADSENSE_CLIENT, SITE_URL, TOOLS, TOOL_CATEGORIES, adsTxt } from "@/lib/site-config";
import { CALCULATORS } from "@/lib/calc/registry";
import { CALCULATOR_CONTENT } from "@/lib/calculator-content";
import { findForbiddenTopics } from "@/lib/content-policy";
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
