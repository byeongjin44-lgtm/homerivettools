/**
 * Calculator registry: the input fields, defaults and result rows of every calculator.
 * The website form, the tests and the blog engine's number check (`scripts/calc.mts`) all read
 * this one file, so a number in a post is always the number the calculator shows.
 *
 * Field defaults are the worked examples from the approved formula table, so each page opens
 * showing a real example calculation.
 */
import { CalcInputError, round } from "./common.ts";
import {
  CONCRETE_BAG_YIELD_CU_FT,
  DECK_BOARD_WIDTH_IN,
  DECK_GAP_IN,
  FLOORING_WASTE_PCT,
  GRAVEL_TONS_PER_CU_YD,
  PAINT_SQ_FT_PER_GALLON,
  TILE_WASTE_PCT,
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

export type NumberField = {
  kind: "number";
  key: string;
  label: string;
  unit?: string;
  default: number;
  step?: number;
  help?: string;
  /** Only shown (and only read) when another field has this value. */
  showWhen?: { key: string; equals: string };
};

export type SelectField = {
  kind: "select";
  key: string;
  label: string;
  default: string;
  options: { value: string; label: string }[];
  help?: string;
  showWhen?: { key: string; equals: string };
};

export type FieldDef = NumberField | SelectField;

export type CalcValues = Record<string, number | string>;

export type ResultRow = {
  key: string;
  label: string;
  value: number;
  unit: string;
  /** Decimal places shown on the page and used when matching numbers in blog posts. */
  digits: number;
  /** The headline answer (e.g. gallons to buy). */
  primary?: boolean;
};

export type CalculatorDef = {
  slug: string;
  fields: FieldDef[];
  compute: (values: CalcValues) => ResultRow[];
};

const num = (v: CalcValues, key: string): number => {
  const value = v[key];
  if (typeof value !== "number") throw new CalcInputError(`${key} must be a number.`);
  return value;
};
const str = (v: CalcValues, key: string): string => String(v[key]);

const row = (key: string, label: string, value: number, unit: string, digits: number, primary = false): ResultRow => ({
  key,
  label,
  value: round(value, digits),
  unit,
  digits,
  primary,
});

const roomFields: FieldDef[] = [
  { kind: "number", key: "lengthFt", label: "Room length", unit: "ft", default: 12, step: 0.5 },
  { kind: "number", key: "widthFt", label: "Room width", unit: "ft", default: 15, step: 0.5 },
  { kind: "number", key: "heightFt", label: "Wall height", unit: "ft", default: 8, step: 0.5 },
  { kind: "number", key: "doors", label: "Doors", default: 1, step: 1 },
  { kind: "number", key: "windows", label: "Windows", default: 2, step: 1 },
];

export const CALCULATORS: CalculatorDef[] = [
  {
    slug: "paint-calculator",
    fields: [
      ...roomFields,
      { kind: "number", key: "coats", label: "Coats", default: 2, step: 1 },
      {
        kind: "number",
        key: "sqFtPerGallon",
        label: "Coverage per gallon",
        unit: "sq ft",
        default: PAINT_SQ_FT_PER_GALLON,
        step: 25,
        help: "Use the coverage printed on your paint can if it differs.",
      },
    ],
    compute: (v) => {
      const r = paint({
        lengthFt: num(v, "lengthFt"),
        widthFt: num(v, "widthFt"),
        heightFt: num(v, "heightFt"),
        doors: num(v, "doors"),
        windows: num(v, "windows"),
        coats: num(v, "coats"),
        sqFtPerGallon: num(v, "sqFtPerGallon"),
      });
      return [
        row("gallons", "Paint to buy", r.gallons, "gallons", 0, true),
        row("gallonsExact", "Exact amount", r.gallonsExact, "gallons", 2),
        row("paintableSqFt", "Paintable wall area", r.paintableSqFt, "sq ft", 1),
        row("wallSqFt", "Total wall area", r.wallSqFt, "sq ft", 1),
        row("openingsSqFt", "Doors and windows deducted", r.openingsSqFt, "sq ft", 0),
      ];
    },
  },
  {
    slug: "concrete-calculator",
    fields: [
      { kind: "number", key: "lengthFt", label: "Length", unit: "ft", default: 10, step: 0.5 },
      { kind: "number", key: "widthFt", label: "Width", unit: "ft", default: 10, step: 0.5 },
      { kind: "number", key: "thicknessIn", label: "Thickness", unit: "in", default: 4, step: 0.5 },
      {
        kind: "select",
        key: "bagLb",
        label: "Bag size",
        default: "80",
        options: Object.keys(CONCRETE_BAG_YIELD_CU_FT).map((lb) => ({
          value: lb,
          label: `${lb} lb (${CONCRETE_BAG_YIELD_CU_FT[Number(lb)]} cu ft)`,
        })),
      },
      {
        kind: "number",
        key: "wastePct",
        label: "Extra for spillage",
        unit: "%",
        default: 0,
        step: 1,
        help: "Optional. Adds a safety margin to the bag count.",
      },
    ],
    compute: (v) => {
      const r = concrete({
        lengthFt: num(v, "lengthFt"),
        widthFt: num(v, "widthFt"),
        thicknessIn: num(v, "thicknessIn"),
        bagLb: Number(str(v, "bagLb")),
        wastePct: num(v, "wastePct"),
      });
      return [
        row("bags", "Bags to buy", r.bags, "bags", 0, true),
        row("cuYd", "Volume", r.cuYd, "cu yd", 2),
        row("cuFt", "Volume", r.cuFt, "cu ft", 2),
        row("bagsExact", "Exact bag count", r.bagsExact, "bags", 1),
      ];
    },
  },
  {
    slug: "tile-calculator",
    fields: [
      { kind: "number", key: "lengthFt", label: "Floor length", unit: "ft", default: 10, step: 0.5 },
      { kind: "number", key: "widthFt", label: "Floor width", unit: "ft", default: 12, step: 0.5 },
      {
        kind: "number",
        key: "sqFtPerBox",
        label: "Coverage per box",
        unit: "sq ft",
        default: 11,
        step: 0.1,
        help: "Printed on the tile box or product page.",
      },
      { kind: "number", key: "wastePct", label: "Extra for cuts", unit: "%", default: TILE_WASTE_PCT, step: 1 },
    ],
    compute: (v) => {
      const r = tile({
        lengthFt: num(v, "lengthFt"),
        widthFt: num(v, "widthFt"),
        sqFtPerBox: num(v, "sqFtPerBox"),
        wastePct: num(v, "wastePct"),
      });
      return [
        row("boxes", "Boxes to buy", r.boxes, "boxes", 0, true),
        row("neededSqFt", "Tile needed incl. extra", r.neededSqFt, "sq ft", 1),
        row("areaSqFt", "Floor area", r.areaSqFt, "sq ft", 1),
      ];
    },
  },
  {
    slug: "flooring-calculator",
    fields: [
      { kind: "number", key: "lengthFt", label: "Room length", unit: "ft", default: 12, step: 0.5 },
      { kind: "number", key: "widthFt", label: "Room width", unit: "ft", default: 15, step: 0.5 },
      {
        kind: "number",
        key: "sqFtPerBox",
        label: "Coverage per box",
        unit: "sq ft",
        default: 20,
        step: 0.1,
        help: "Printed on the flooring box or product page.",
      },
      {
        kind: "select",
        key: "layout",
        label: "Layout",
        default: "straight",
        options: [
          { value: "straight", label: `Straight (${FLOORING_WASTE_PCT.straight}% extra)` },
          { value: "diagonal", label: `Diagonal (${FLOORING_WASTE_PCT.diagonal}% extra)` },
          { value: "custom", label: "Custom extra %" },
        ],
      },
      {
        kind: "number",
        key: "wastePct",
        label: "Extra for cuts",
        unit: "%",
        default: 10,
        step: 1,
        showWhen: { key: "layout", equals: "custom" },
      },
    ],
    compute: (v) => {
      const layout = str(v, "layout");
      const wastePct =
        layout === "straight"
          ? FLOORING_WASTE_PCT.straight
          : layout === "diagonal"
            ? FLOORING_WASTE_PCT.diagonal
            : num(v, "wastePct");
      const r = flooring({
        lengthFt: num(v, "lengthFt"),
        widthFt: num(v, "widthFt"),
        sqFtPerBox: num(v, "sqFtPerBox"),
        wastePct,
      });
      return [
        row("boxes", "Boxes to buy", r.boxes, "boxes", 0, true),
        row("neededSqFt", "Flooring needed incl. extra", r.neededSqFt, "sq ft", 1),
        row("areaSqFt", "Floor area", r.areaSqFt, "sq ft", 1),
        row("wastePct", "Extra included", wastePct, "%", 0),
      ];
    },
  },
  {
    slug: "mulch-calculator",
    fields: [
      { kind: "number", key: "lengthFt", label: "Bed length", unit: "ft", default: 20, step: 0.5 },
      { kind: "number", key: "widthFt", label: "Bed width", unit: "ft", default: 10, step: 0.5 },
      { kind: "number", key: "depthIn", label: "Depth", unit: "in", default: 3, step: 0.5 },
      {
        kind: "select",
        key: "bagCuFt",
        label: "Bag size",
        default: "2",
        options: [
          { value: "1.5", label: "1.5 cu ft" },
          { value: "2", label: "2 cu ft" },
          { value: "3", label: "3 cu ft" },
        ],
      },
    ],
    compute: (v) => {
      const r = mulch({
        lengthFt: num(v, "lengthFt"),
        widthFt: num(v, "widthFt"),
        depthIn: num(v, "depthIn"),
        bagCuFt: Number(str(v, "bagCuFt")),
      });
      return [
        row("cuYd", "Bulk amount", r.cuYd, "cu yd", 2, true),
        row("bags", "Or bags", r.bags, "bags", 0, true),
        row("cuFt", "Volume", r.cuFt, "cu ft", 1),
        row("areaSqFt", "Bed area", r.areaSqFt, "sq ft", 1),
      ];
    },
  },
  {
    slug: "square-footage-calculator",
    fields: [
      {
        kind: "select",
        key: "shape",
        label: "Shape",
        default: "rectangle",
        options: [
          { value: "rectangle", label: "Rectangle or square" },
          { value: "triangle", label: "Triangle" },
          { value: "circle", label: "Circle" },
        ],
      },
      { kind: "number", key: "lengthFt", label: "Length", unit: "ft", default: 10, step: 0.5, showWhen: { key: "shape", equals: "rectangle" } },
      { kind: "number", key: "widthFt", label: "Width", unit: "ft", default: 12, step: 0.5, showWhen: { key: "shape", equals: "rectangle" } },
      { kind: "number", key: "baseFt", label: "Base", unit: "ft", default: 6, step: 0.5, showWhen: { key: "shape", equals: "triangle" } },
      { kind: "number", key: "heightFt", label: "Height", unit: "ft", default: 4, step: 0.5, showWhen: { key: "shape", equals: "triangle" } },
      { kind: "number", key: "radiusFt", label: "Radius", unit: "ft", default: 5, step: 0.5, showWhen: { key: "shape", equals: "circle" } },
    ],
    compute: (v) => {
      const shape = str(v, "shape");
      const r =
        shape === "rectangle"
          ? area({ shape, lengthFt: num(v, "lengthFt"), widthFt: num(v, "widthFt") })
          : shape === "triangle"
            ? area({ shape, baseFt: num(v, "baseFt"), heightFt: num(v, "heightFt") })
            : shape === "circle"
              ? area({ shape, radiusFt: num(v, "radiusFt") })
              : (() => {
                  throw new CalcInputError("Shape must be rectangle, triangle or circle.");
                })();
      return [
        row("sqFt", "Area", r.sqFt, "sq ft", 2, true),
        row("sqYd", "Area", r.sqYd, "sq yd", 2),
        row("sqM", "Area", r.sqM, "m²", 2),
      ];
    },
  },
  {
    slug: "wallpaper-calculator",
    fields: [
      ...roomFields,
      {
        kind: "number",
        key: "repeatIn",
        label: "Pattern repeat",
        unit: "in",
        default: 15,
        step: 1,
        help: "0 for no pattern. Printed on the wallpaper label.",
      },
    ],
    compute: (v) => {
      const r = wallpaper({
        lengthFt: num(v, "lengthFt"),
        widthFt: num(v, "widthFt"),
        heightFt: num(v, "heightFt"),
        doors: num(v, "doors"),
        windows: num(v, "windows"),
        repeatIn: num(v, "repeatIn"),
      });
      return [
        row("doubleRolls", "Double rolls to buy", r.doubleRolls, "double rolls", 0, true),
        row("singleRolls", "Single rolls", r.singleRolls, "single rolls", 0),
        row("netSqFt", "Wall area to cover", r.netSqFt, "sq ft", 1),
        row("sqFtPerSingleRoll", "Usable area per single roll", r.sqFtPerSingleRoll, "sq ft", 0),
      ];
    },
  },
  {
    slug: "gravel-calculator",
    fields: [
      { kind: "number", key: "lengthFt", label: "Length", unit: "ft", default: 20, step: 0.5 },
      { kind: "number", key: "widthFt", label: "Width", unit: "ft", default: 10, step: 0.5 },
      { kind: "number", key: "depthIn", label: "Depth", unit: "in", default: 3, step: 0.5 },
      {
        kind: "number",
        key: "tonsPerCuYd",
        label: "Weight per cubic yard",
        unit: "tons",
        default: GRAVEL_TONS_PER_CU_YD,
        step: 0.05,
        help: "Ask your supplier for the weight of the exact material.",
      },
    ],
    compute: (v) => {
      const r = gravel({
        lengthFt: num(v, "lengthFt"),
        widthFt: num(v, "widthFt"),
        depthIn: num(v, "depthIn"),
        tonsPerCuYd: num(v, "tonsPerCuYd"),
      });
      return [
        row("tons", "Weight", r.tons, "tons", 2, true),
        row("cuYd", "Volume", r.cuYd, "cu yd", 2, true),
        row("cuFt", "Volume", r.cuFt, "cu ft", 1),
        row("areaSqFt", "Area", r.areaSqFt, "sq ft", 1),
      ];
    },
  },
  {
    slug: "deck-board-calculator",
    fields: [
      {
        kind: "number",
        key: "deckLengthFt",
        label: "Deck length (along the boards)",
        unit: "ft",
        default: 16,
        step: 0.5,
      },
      {
        kind: "number",
        key: "deckWidthFt",
        label: "Deck width (across the boards)",
        unit: "ft",
        default: 12,
        step: 0.5,
      },
      {
        kind: "number",
        key: "boardWidthIn",
        label: "Actual board width",
        unit: "in",
        default: DECK_BOARD_WIDTH_IN,
        step: 0.25,
        help: "Use the actual width from the product page (a 6 in board is often 5.5 in).",
      },
      {
        kind: "select",
        key: "boardLengthFt",
        label: "Board length",
        default: "16",
        options: ["8", "10", "12", "16", "20"].map((ft) => ({ value: ft, label: `${ft} ft` })),
      },
      { kind: "number", key: "gapIn", label: "Gap between boards", unit: "in", default: DECK_GAP_IN, step: 0.0625 },
      { kind: "number", key: "wastePct", label: "Extra boards", unit: "%", default: 0, step: 1 },
    ],
    compute: (v) => {
      const r = decking({
        deckLengthFt: num(v, "deckLengthFt"),
        deckWidthFt: num(v, "deckWidthFt"),
        boardWidthIn: num(v, "boardWidthIn"),
        boardLengthFt: Number(str(v, "boardLengthFt")),
        gapIn: num(v, "gapIn"),
        wastePct: num(v, "wastePct"),
      });
      return [
        row("boards", "Boards to buy", r.boards, "boards", 0, true),
        row("rows", "Rows of boards", r.rows, "rows", 0),
        row("boardsPerRow", "Boards per row", r.boardsPerRow, "boards", 0),
        row("linearFt", "Total board length", r.linearFt, "linear ft", 0),
      ];
    },
  },
  {
    slug: "insulation-calculator",
    fields: [
      { kind: "number", key: "areaSqFt", label: "Area to insulate", unit: "sq ft", default: 500, step: 10 },
      { kind: "number", key: "targetR", label: "Target R-value", default: 15, step: 1 },
      {
        kind: "number",
        key: "rPerInch",
        label: "R-value per inch of your product",
        default: 5,
        step: 0.1,
        help: "Printed on the product label. See the reference table below.",
      },
      {
        kind: "number",
        key: "sqFtPerPackage",
        label: "Coverage per package",
        unit: "sq ft",
        default: 40,
        step: 1,
        help: "Printed on the package for the thickness you need.",
      },
    ],
    compute: (v) => {
      const r = insulation({
        areaSqFt: num(v, "areaSqFt"),
        targetR: num(v, "targetR"),
        rPerInch: num(v, "rPerInch"),
        sqFtPerPackage: num(v, "sqFtPerPackage"),
      });
      return [
        row("thicknessIn", "Thickness needed", r.thicknessIn, "in", 2, true),
        row("packages", "Packages to buy", r.packages, "packages", 0, true),
        row("packagesExact", "Exact package count", r.packagesExact, "packages", 2),
      ];
    },
  },
];

export function getCalculator(slug: string): CalculatorDef {
  const calc = CALCULATORS.find((c) => c.slug === slug);
  if (!calc) throw new Error(`Unknown calculator "${slug}"`);
  return calc;
}

/** True when a field is shown (and read) for the current values. */
export function isFieldActive(field: FieldDef, values: CalcValues): boolean {
  return !field.showWhen || String(values[field.showWhen.key]) === field.showWhen.equals;
}

/** The default (worked-example) values of a calculator. */
export function defaultValues(calc: CalculatorDef): CalcValues {
  return Object.fromEntries(calc.fields.map((f) => [f.key, f.default]));
}

/**
 * Run a calculator from loosely-typed input (the form, or JSON from the blog engine):
 * missing fields take their default, numeric strings become numbers, inactive fields are ignored.
 */
export function runCalculator(slug: string, input: Record<string, unknown> = {}): ResultRow[] {
  const calc = getCalculator(slug);
  const unknown = Object.keys(input).filter((k) => !calc.fields.some((f) => f.key === k));
  if (unknown.length) throw new CalcInputError(`Unknown input: ${unknown.join(", ")}`);
  const values: CalcValues = defaultValues(calc);
  for (const field of calc.fields) {
    if (!(field.key in input)) continue;
    const raw = input[field.key];
    if (field.kind === "number") {
      const n = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
      if (!Number.isFinite(n)) throw new CalcInputError(`${field.label} must be a number.`);
      values[field.key] = n;
    } else {
      const s = String(raw);
      if (!field.options.some((o) => o.value === s))
        throw new CalcInputError(`${field.label} must be one of: ${field.options.map((o) => o.value).join(", ")}`);
      values[field.key] = s;
    }
  }
  return calc.compute(values);
}

/** "1,234.5" style number formatting used on the page and in posts. */
export function formatNumber(value: number, digits: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
