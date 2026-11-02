/**
 * Locked worked examples from the approved Korean formula table ("사이트 B 계산기 공식·근거표").
 * If one of these fails, a formula or constant changed. Do not edit the expected numbers to make
 * a test pass without the site owner's explicit approval (CLAUDE.md).
 */
import { describe, expect, it } from "vitest";
import { CalcInputError, ceilUnits, round } from "./common.ts";
import {
  CONCRETE_BAG_YIELD_CU_FT,
  DECK_GAP_IN,
  FLOORING_WASTE_PCT,
  GRAVEL_TONS_PER_CU_YD,
  PAINT_SQ_FT_PER_GALLON,
  TILE_WASTE_PCT,
  WALLPAPER_YIELD_BANDS,
  area,
  concrete,
  decking,
  flooring,
  gravel,
  insulation,
  mulch,
  paint,
  tile,
  wallpaper,
} from "./formulas.ts";
import { CALCULATORS, defaultValues, runCalculator } from "./registry.ts";

describe("locked constants", () => {
  it("match the cited sources", () => {
    expect(PAINT_SQ_FT_PER_GALLON).toBe(350);
    expect(CONCRETE_BAG_YIELD_CU_FT).toEqual({ 40: 0.3, 50: 0.375, 60: 0.45, 80: 0.6, 90: 0.675 });
    expect(TILE_WASTE_PCT).toBe(10);
    expect(FLOORING_WASTE_PCT).toEqual({ straight: 7, diagonal: 15 });
    expect(WALLPAPER_YIELD_BANDS.map((b) => [b.maxRepeatIn, b.sqFtPerSingleRoll])).toEqual([
      [6, 25],
      [12, 22],
      [18, 20],
      [23, 18],
    ]);
    expect(GRAVEL_TONS_PER_CU_YD).toBe(1.4);
    expect(DECK_GAP_IN).toBe(0.1875);
  });
});

describe("worked examples", () => {
  it("1. paint: 12×15 ft room, 8 ft walls, 1 door, 2 windows, 2 coats → 3 gallons", () => {
    const r = paint({ lengthFt: 12, widthFt: 15, heightFt: 8, doors: 1, windows: 2, coats: 2, sqFtPerGallon: 350 });
    expect(r.wallSqFt).toBe(432);
    expect(r.paintableSqFt).toBe(372);
    expect(round(r.gallonsExact)).toBe(2.13);
    expect(r.gallons).toBe(3);
  });

  it("2. concrete: 10×10 ft slab, 4 in thick, 80 lb bags → 56 bags", () => {
    const r = concrete({ lengthFt: 10, widthFt: 10, thicknessIn: 4, bagLb: 80, wastePct: 0 });
    expect(round(r.cuFt)).toBe(33.33);
    expect(round(r.cuYd)).toBe(1.23);
    expect(round(r.bagsExact, 1)).toBe(55.6);
    expect(r.bags).toBe(56);
  });

  it("3. tile: 10×12 ft, 11 sq ft boxes, 10% extra → 12 boxes", () => {
    const r = tile({ lengthFt: 10, widthFt: 12, sqFtPerBox: 11, wastePct: 10 });
    expect(r.areaSqFt).toBe(120);
    expect(round(r.neededSqFt)).toBe(132);
    expect(r.boxes).toBe(12);
  });

  it("4. flooring: 12×15 ft, 20 sq ft boxes, straight (7%) → 10 boxes", () => {
    const r = flooring({ lengthFt: 12, widthFt: 15, sqFtPerBox: 20, wastePct: 7 });
    expect(r.areaSqFt).toBe(180);
    expect(round(r.neededSqFt, 1)).toBe(192.6);
    expect(r.boxes).toBe(10);
  });

  it("5. mulch: 200 sq ft, 3 in deep, 2 cu ft bags → 1.85 cu yd = 25 bags", () => {
    const r = mulch({ lengthFt: 20, widthFt: 10, depthIn: 3, bagCuFt: 2 });
    expect(round(r.cuYd)).toBe(1.85);
    expect(round(r.cuFt)).toBe(50);
    expect(r.bags).toBe(25);
  });

  it("6. area: rectangle, triangle and circle", () => {
    expect(area({ shape: "rectangle", lengthFt: 10, widthFt: 12 }).sqFt).toBe(120);
    expect(area({ shape: "triangle", baseFt: 6, heightFt: 4 }).sqFt).toBe(12);
    expect(round(area({ shape: "circle", radiusFt: 5 }).sqFt)).toBe(78.54);
    expect(round(area({ shape: "rectangle", lengthFt: 9, widthFt: 1 }).sqYd)).toBe(1);
  });

  it("7. wallpaper: 372 sq ft, 15 in repeat → 19 single = 10 double rolls", () => {
    const r = wallpaper({ lengthFt: 12, widthFt: 15, heightFt: 8, doors: 1, windows: 2, repeatIn: 15 });
    expect(r.netSqFt).toBe(372);
    expect(r.sqFtPerSingleRoll).toBe(20);
    expect(r.singleRolls).toBe(19);
    expect(r.doubleRolls).toBe(10);
  });

  it("8. gravel: 200 sq ft, 3 in deep, 1.4 t/cu yd → 2.59 tons", () => {
    const r = gravel({ lengthFt: 20, widthFt: 10, depthIn: 3, tonsPerCuYd: 1.4 });
    expect(round(r.cuYd)).toBe(1.85);
    expect(round(r.tons)).toBe(2.59);
  });

  it("9. decking: 12 ft wide, 16 ft boards along a 16 ft deck → 26 boards", () => {
    const r = decking({ deckLengthFt: 16, deckWidthFt: 12, boardWidthIn: 5.5, boardLengthFt: 16, gapIn: 0.1875, wastePct: 0 });
    expect(round(r.rowsExact, 1)).toBe(25.3);
    expect(r.rows).toBe(26);
    expect(r.boards).toBe(26);
  });

  it("10. insulation: R15 with R5/in XPS → 3 in; 500 sq ft / 40 sq ft → 13 packages", () => {
    const r = insulation({ areaSqFt: 500, targetR: 15, rPerInch: 5, sqFtPerPackage: 40 });
    expect(r.thicknessIn).toBe(3);
    expect(r.packages).toBe(13);
  });
});

describe("rules", () => {
  it("rounds purchasable units up, ignoring float noise", () => {
    expect(ceilUnits(2.01)).toBe(3);
    expect(ceilUnits(12.000000000000002)).toBe(12);
  });

  it("rejects invalid input with a readable error", () => {
    expect(() => paint({ lengthFt: 0, widthFt: 15, heightFt: 8, doors: 0, windows: 0, coats: 2, sqFtPerGallon: 350 })).toThrow(
      CalcInputError,
    );
    expect(() => concrete({ lengthFt: 10, widthFt: 10, thicknessIn: 4, bagLb: 70, wastePct: 0 })).toThrow(/Bag size/);
    expect(() => wallpaper({ lengthFt: 12, widthFt: 15, heightFt: 8, doors: 0, windows: 0, repeatIn: 30 })).toThrow(/label/);
    expect(() => tile({ lengthFt: 10, widthFt: 12, sqFtPerBox: 11, wastePct: 150 })).toThrow(/100%/);
  });

  it("never returns negative wall area", () => {
    expect(paint({ lengthFt: 2, widthFt: 2, heightFt: 2, doors: 5, windows: 5, coats: 1, sqFtPerGallon: 350 }).gallons).toBe(0);
  });
});

describe("registry", () => {
  it("has 10 calculators with unique slugs", () => {
    expect(CALCULATORS).toHaveLength(10);
    expect(new Set(CALCULATORS.map((c) => c.slug)).size).toBe(10);
  });

  it("opens every calculator on its worked example", () => {
    const primary = (slug: string) =>
      runCalculator(slug)
        .filter((r) => r.primary)
        .map((r) => r.value);
    expect(primary("paint-calculator")).toEqual([3]);
    expect(primary("concrete-calculator")).toEqual([56]);
    expect(primary("tile-calculator")).toEqual([12]);
    expect(primary("flooring-calculator")).toEqual([10]);
    expect(primary("mulch-calculator")).toEqual([1.85, 25]);
    expect(primary("square-footage-calculator")).toEqual([120]);
    expect(primary("wallpaper-calculator")).toEqual([10]);
    expect(primary("gravel-calculator")).toEqual([2.59, 1.85]);
    expect(primary("deck-board-calculator")).toEqual([26]);
    expect(primary("insulation-calculator")).toEqual([3, 13]);
  });

  it("uses the layout's waste for flooring and the custom value only when chosen", () => {
    const boxes = (input: Record<string, unknown>) => runCalculator("flooring-calculator", input)[0].value;
    expect(boxes({ layout: "diagonal" })).toBe(11); // 180 × 1.15 = 207 → 10.35 → 11
    expect(boxes({ layout: "custom", wastePct: 0 })).toBe(9);
    expect(boxes({ layout: "straight", wastePct: 50 })).toBe(10);
  });

  it("accepts numeric strings and rejects unknown or invalid input", () => {
    expect(runCalculator("square-footage-calculator", { shape: "circle", radiusFt: "5" })[0].value).toBe(78.54);
    expect(() => runCalculator("tile-calculator", { color: "red" })).toThrow(/Unknown input/);
    expect(() => runCalculator("tile-calculator", { lengthFt: "abc" })).toThrow(/must be a number/);
    expect(() => runCalculator("mulch-calculator", { bagCuFt: "7" })).toThrow(/one of/);
  });

  it("every default is a valid option or number", () => {
    for (const calc of CALCULATORS) expect(() => calc.compute(defaultValues(calc))).not.toThrow();
  });
});
