import { describe, expect, it } from "vitest";
import { getAllPosts, postText } from "@/lib/blog";
import { pinAnswers, pinImagePath } from "@/lib/pin";

describe("pinAnswers", () => {
  it("shows the calculator's headline answer", () => {
    expect(pinAnswers({ calculations: [{ calculator: "paint-calculator", input: { lengthFt: 12, widthFt: 12, heightFt: 8, doors: 1, windows: 1 } }] })).toEqual([
      "2 gallons",
    ]);
  });

  it("names the input that differs when a guide compares options", () => {
    const answers = pinAnswers({
      calculations: [
        { calculator: "concrete-calculator", input: { lengthFt: 10, widthFt: 10, thicknessIn: 4, bagLb: "80" } },
        { calculator: "concrete-calculator", input: { lengthFt: 10, widthFt: 10, thicknessIn: 4, bagLb: "60" } },
      ],
    });
    expect(answers).toEqual(["56 bags (Bag size: 80 lb)", "75 bags (Bag size: 60 lb)"]);
  });

  it("returns nothing for a guide without calculations", () => {
    expect(pinAnswers({})).toEqual([]);
  });

  it("every published guide has an answer line that appears in its own text", () => {
    for (const post of getAllPosts()) {
      const answers = pinAnswers(post);
      expect(answers.length, post.slug).toBeGreaterThan(0);
      for (const a of answers) expect(postText(post), post.slug).toContain(a.split(" ")[0]);
    }
  });

  it("uses one path per key", () => {
    expect(pinImagePath("blog-x")).toBe("/pin/blog-x.png");
  });
});
