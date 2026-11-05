import fs from "node:fs";
import path from "node:path";
import { TOOLS, type ToolDefinition } from "@/lib/site-config";
import { findForbiddenTopics, MANUFACTURER_NOTE_RE } from "@/lib/content-policy";
import { formatNumber, runCalculator } from "@/lib/calc/registry";

/**
 * Blog posts are plain JSON files in `content/blog/<slug>.json`, read at build time.
 * JSON (not Markdown/MDX) keeps the site dependency-free and lets an automated pipeline
 * produce posts that are validated structurally before they can be published.
 */
export const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; text: string; lang?: string };

export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description, also shown on the blog index. */
  description: string;
  /** ISO dates (YYYY-MM-DD). */
  published: string;
  updated?: string;
  /** Slug of the tool this post is about; drives the "Try it" button and the tool page's related posts. */
  relatedTool?: string;
  /** Manufacturer or public-agency pages the post's figures come from (at least one). */
  sources: { title: string; url: string }[];
  /**
   * Calculator runs behind the numbers in the post. Every headline result of each run must
   * appear in the post text exactly as the calculator formats it, so a post can never show a
   * number the calculator would not produce.
   */
  calculations?: { calculator: string; input: Record<string, number | string> }[];
  body: BlogBlock[];
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isNonEmptyString = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

/** Throws a descriptive error if `data` is not a publishable post. Returns the post typed. */
export function validatePost(data: unknown, expectedSlug?: string): BlogPost {
  const fail = (msg: string): never => {
    throw new Error(`Invalid blog post${expectedSlug ? ` "${expectedSlug}"` : ""}: ${msg}`);
  };
  if (typeof data !== "object" || data === null) fail("not an object");
  const post = data as Record<string, unknown>;

  if (!isNonEmptyString(post.slug) || !SLUG_RE.test(post.slug)) fail("slug must be lowercase-kebab-case");
  if (expectedSlug !== undefined && post.slug !== expectedSlug) fail(`slug must match the file name`);
  if (!isNonEmptyString(post.title)) fail("title is required");
  if (!isNonEmptyString(post.description) || (post.description as string).length < 50)
    fail("description must be at least 50 characters");
  if (!isNonEmptyString(post.published) || !DATE_RE.test(post.published)) fail("published must be YYYY-MM-DD");
  if (post.updated !== undefined && (!isNonEmptyString(post.updated) || !DATE_RE.test(post.updated)))
    fail("updated must be YYYY-MM-DD");
  if (post.relatedTool !== undefined && !TOOLS.some((t) => t.slug === post.relatedTool))
    fail(`relatedTool "${String(post.relatedTool)}" is not a tool slug`);
  if (!Array.isArray(post.body) || post.body.length === 0) fail("body must be a non-empty array");

  for (const [i, block] of (post.body as unknown[]).entries()) {
    const b = block as Record<string, unknown>;
    switch (b?.type) {
      case "p":
      case "h2":
      case "h3":
        if (!isNonEmptyString(b.text)) fail(`body[${i}] ${b.type} needs text`);
        break;
      case "ul":
      case "ol":
        if (!Array.isArray(b.items) || b.items.length === 0 || !b.items.every(isNonEmptyString))
          fail(`body[${i}] ${b.type} needs non-empty items`);
        break;
      case "code":
        if (!isNonEmptyString(b.text)) fail(`body[${i}] code needs text`);
        if (b.lang !== undefined && typeof b.lang !== "string") fail(`body[${i}] code lang must be a string`);
        break;
      default:
        fail(`body[${i}] has unknown type "${String(b?.type)}"`);
    }
  }
  if (!Array.isArray(post.sources) || post.sources.length === 0) fail("sources must list at least one source");
  for (const [i, src] of (post.sources as unknown[]).entries()) {
    const s = src as Record<string, unknown>;
    if (!isNonEmptyString(s?.title) || !isNonEmptyString(s?.url) || !/^https:\/\/\S+$/.test(s.url as string))
      fail(`sources[${i}] needs a title and an https url`);
  }

  const text = postText(post as unknown as BlogPost);
  const forbidden = findForbiddenTopics(text);
  if (forbidden.length) fail(`forbidden topic (${forbidden.join("; ")})`);
  if (!MANUFACTURER_NOTE_RE.test(text)) fail("must tell readers to check the manufacturer's label");

  if (post.calculations !== undefined) {
    if (!Array.isArray(post.calculations)) fail("calculations must be an array");
    for (const [i, calc] of (post.calculations as unknown[]).entries()) {
      const c = calc as Record<string, unknown>;
      if (!TOOLS.some((t) => t.slug === c?.calculator)) fail(`calculations[${i}] has unknown calculator`);
      let rows;
      try {
        rows = runCalculator(c.calculator as string, (c.input ?? {}) as Record<string, unknown>);
      } catch (e) {
        fail(`calculations[${i}] input is invalid: ${(e as Error).message}`);
      }
      for (const r of rows!.filter((r) => r.primary)) {
        const shown = formatNumber(r.value, r.digits);
        if (!new RegExp(`(^|[^\\d.,])${shown.replace(/[.,]/g, "\\$&")}(?![\\d]|[.,]\\d)`).test(text))
          fail(`calculations[${i}] result "${shown} ${r.unit}" (${r.label}) does not appear in the post`);
      }
    }
  }
  return post as unknown as BlogPost;
}

/** All reader-visible text of a post, for policy and number checks. */
export function postText(post: Pick<BlogPost, "title" | "description" | "body">): string {
  const parts = [post.title, post.description];
  for (const b of post.body ?? []) {
    if ("text" in b) parts.push(b.text);
    if ("items" in b) parts.push(...b.items);
  }
  return parts.join("\n");
}

function readPostFile(file: string): BlogPost {
  const slug = file.replace(/\.json$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  return validatePost(JSON.parse(raw), slug);
}

/** All posts, newest first. Posts dated in the future are not published yet. */
export function getAllPosts(today: string = new Date().toISOString().slice(0, 10)): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".json"))
    .map(readPostFile)
    .filter((p) => p.published <= today)
    .sort((a, b) => (a.published === b.published ? a.slug.localeCompare(b.slug) : b.published.localeCompare(a.published)));
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsForTool(toolSlug: string, limit = 5): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.relatedTool === toolSlug)
    .slice(0, limit);
}

/**
 * Guides to show under a post: same calculator first, then the same category, then the newest.
 * Never the post itself. Ties keep the newest-first order of `posts`.
 */
export function getRelatedPosts(post: BlogPost, limit = 3, posts: BlogPost[] = getAllPosts()): BlogPost[] {
  const categoryOf = (p: BlogPost) => TOOLS.find((t) => t.slug === p.relatedTool)?.category;
  const category = categoryOf(post);
  const rank = (p: BlogPost) =>
    post.relatedTool && p.relatedTool === post.relatedTool ? 0 : category && categoryOf(p) === category ? 1 : 2;
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p, index) => ({ p, index, rank: rank(p) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, limit)
    .map(({ p }) => p);
}

export function getPostTool(post: BlogPost): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === post.relatedTool);
}

export const blogPath = (slug: string) => `/blog/${slug}`;

/** Inline segments of a text: plain text, `code`, and [label](href) links. */
export type InlineSegment =
  | { kind: "text"; value: string }
  | { kind: "code"; value: string }
  | { kind: "link"; value: string; href: string };

const INLINE_RE = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    const index = m.index ?? 0;
    if (index > last) segments.push({ kind: "text", value: text.slice(last, index) });
    if (m[1] !== undefined) segments.push({ kind: "code", value: m[1] });
    else segments.push({ kind: "link", value: m[2], href: m[3] });
    last = index + m[0].length;
  }
  if (last < text.length) segments.push({ kind: "text", value: text.slice(last) });
  return segments;
}
