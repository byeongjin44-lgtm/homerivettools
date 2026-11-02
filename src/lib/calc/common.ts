/**
 * Shared helpers for the material calculators.
 *
 * Calculator files import each other with explicit `.ts` extensions so the same code runs in
 * Next.js, in Vitest and directly in Node (`node scripts/calc.mts`) for the blog engine.
 * Keep these files free of `@/` imports, enums and namespaces for that reason.
 */

export class CalcInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalcInputError";
  }
}

/** 1 cubic yard = 27 cubic feet; 1 inch of depth over 324 sq ft = 1 cubic yard (27 × 12). */
export const CU_FT_PER_CU_YD = 27;
export const SQ_FT_PER_CU_YD_PER_INCH = 324;
export const SQ_FT_PER_SQ_YD = 9;
export const SQ_M_PER_SQ_FT = 0.09290304;

/**
 * Round up to a whole purchasable unit (cans, bags, boxes, rolls, boards).
 * The small tolerance stops floating-point noise such as 12.000000000000002 from adding a unit.
 */
export function ceilUnits(value: number): number {
  return Math.max(0, Math.ceil(value - 1e-9));
}

/** Round for display/comparison: `digits` decimal places, no trailing float noise. */
export function round(value: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round((value + Number.EPSILON) * f) / f;
}

/** Throws unless `value` is a finite number > 0 (or >= 0 when `allowZero`). */
export function requirePositive(name: string, value: number, allowZero = false): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new CalcInputError(`${name} must be a number.`);
  if (allowZero ? value < 0 : value <= 0)
    throw new CalcInputError(`${name} must be ${allowZero ? "zero or more" : "greater than zero"}.`);
  return value;
}

/** Whole-number count (doors, windows, coats) that is zero or more. */
export function requireCount(name: string, value: number): number {
  requirePositive(name, value, true);
  if (!Number.isInteger(value)) throw new CalcInputError(`${name} must be a whole number.`);
  return value;
}

/** Waste/overage percentage between 0 and 100. */
export function requirePercent(name: string, value: number): number {
  requirePositive(name, value, true);
  if (value > 100) throw new CalcInputError(`${name} must be 100% or less.`);
  return value;
}

/** Wall area of a rectangular room: perimeter × height. */
export function roomWallArea(lengthFt: number, widthFt: number, heightFt: number): number {
  return (lengthFt + widthFt) * 2 * heightFt;
}

/**
 * Standard deduction per door or window used by Sherwin-Williams' estimating guide: 20 sq ft each.
 * https://www.sherwin-williams.com/homeowners/how-to/wallpapering-how-tos/sw-article-dir-howtoestimate
 */
export const OPENING_SQ_FT = 20;
