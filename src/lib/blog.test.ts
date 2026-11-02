import { describe, expect, it } from "vitest";
import { getAllPosts, parseInline, postText, validatePost } from "@/lib/blog";

const valid = {
  slug: "example-post",
  title: "How much paint for a 12 by 15 room",
  description: "A description that is comfortably longer than fifty characters in total.",
  published: "2026-11-02",
  relatedTool: "paint-calculator",
  sources: [{ title: "Sherwin-Williams paint calculator", url: "https://www.sherwin-williams.com/" }],
  calculations: [{ calculator: "paint-calculator", input: { lengthFt: 12, widthFt: 15 } }],
  body: [
    { type: "p", text: "A 12 × 15 ft room with 8 ft walls needs 3 gallons for two coats." },
    { type: "ul", items: ["Check the coverage printed on the can.", "b"] },
  ],
};

describe("validatePost", () => {
  it("accepts a valid post", () => {
    expect(validatePost(valid, "example-post").slug).toBe("example-post");
  });

  it.each([
    ["slug mismatch", { ...valid }, "other-slug"],
    ["bad slug", { ...valid, slug: "Bad Slug" }, undefined],
    ["short description", { ...valid, description: "too short" }, undefined],
    ["bad date", { ...valid, published: "02/11/2026" }, undefined],
    ["unknown tool", { ...valid, relatedTool: "image-resizer" }, undefined],
    ["empty body", { ...valid, body: [] }, undefined],
    ["unknown block", { ...valid, body: [{ type: "html", text: "<b>x</b>" }] }, undefined],
    ["empty list", { ...valid, body: [{ type: "ul", items: [] }] }, undefined],
    ["no sources", { ...valid, sources: [] }, undefined],
    ["http source", { ...valid, sources: [{ title: "x", url: "http://example.com" }] }, undefined],
  ])("rejects %s", (_name, data, slug) => {
    expect(() => validatePost(data, slug)).toThrow(/Invalid blog post/);
  });

  it("rejects a forbidden topic anywhere in the post", () => {
    const post = { ...valid, body: [...valid.body, { type: "h2", text: "Moving the circuit breaker" }] };
    expect(() => validatePost(post)).toThrow(/forbidden topic.*circuit breaker/);
  });

  it("requires a manufacturer-label reminder", () => {
    const post = { ...valid, body: [{ type: "p", text: "A 12 × 15 ft room needs 3 gallons." }] };
    expect(() => validatePost(post)).toThrow(/manufacturer/);
  });

  it("rejects a post whose number differs from the calculator", () => {
    const post = { ...valid, body: [{ type: "p", text: "You need 4 gallons. Check the label on the can." }] };
    expect(() => validatePost(post)).toThrow(/"3 gallons".*does not appear/);
  });

  it("does not accept the number inside a bigger number", () => {
    const post = { ...valid, body: [{ type: "p", text: "Spend 13 dollars or 2.3 hours. Check the label on the can." }] };
    expect(() => validatePost(post)).toThrow(/does not appear/);
  });

  it("rejects invalid calculation input", () => {
    const post = { ...valid, calculations: [{ calculator: "paint-calculator", input: { coats: "many" } }] };
    expect(() => validatePost(post)).toThrow(/input is invalid/);
  });
});

describe("postText", () => {
  it("joins title, description and all block text", () => {
    expect(postText(valid as never)).toContain("Check the coverage printed on the can.");
  });
});

describe("parseInline", () => {
  it("splits text, inline code and links", () => {
    expect(parseInline("Use `0.60` in the [calculator](/concrete-calculator).")).toEqual([
      { kind: "text", value: "Use " },
      { kind: "code", value: "0.60" },
      { kind: "text", value: " in the " },
      { kind: "link", value: "calculator", href: "/concrete-calculator" },
      { kind: "text", value: "." },
    ]);
  });
});

describe("content/blog", () => {
  it("every post file is valid, newest first", () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) expect(posts[i - 1].published >= posts[i].published).toBe(true);
  });

  it("hides posts dated in the future", () => {
    expect(getAllPosts("1999-01-01")).toEqual([]);
  });
});
