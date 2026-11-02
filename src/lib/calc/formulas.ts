/**
 * The 10 material formulas. Every constant here comes from the source linked next to it and was
 * approved in the Korean formula table ("사이트 B 계산기 공식·근거표"). Do not change a formula,
 * constant or default without the site owner's explicit approval — see CLAUDE.md.
 */
import {
  CU_FT_PER_CU_YD,
  CalcInputError,
  OPENING_SQ_FT,
  SQ_FT_PER_CU_YD_PER_INCH,
  SQ_FT_PER_SQ_YD,
  SQ_M_PER_SQ_FT,
  ceilUnits,
  requireCount,
  requirePercent,
  requirePositive,
  roomWallArea,
} from "./common.ts";

// 1. Paint -------------------------------------------------------------------------------------

/** Sherwin-Williams: one gallon covers about 350–400 sq ft; the low end is used so you don't run short. */
export const PAINT_SQ_FT_PER_GALLON = 350;

export type PaintInput = {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  doors: number;
  windows: number;
  coats: number;
  sqFtPerGallon: number;
};

export function paint(i: PaintInput) {
  requirePositive("Room length", i.lengthFt);
  requirePositive("Room width", i.widthFt);
  requirePositive("Wall height", i.heightFt);
  requireCount("Doors", i.doors);
  requireCount("Windows", i.windows);
  requireCount("Coats", i.coats);
  if (i.coats < 1) throw new CalcInputError("Coats must be at least 1.");
  requirePositive("Coverage per gallon", i.sqFtPerGallon);
  const wallSqFt = roomWallArea(i.lengthFt, i.widthFt, i.heightFt);
  const openingsSqFt = (i.doors + i.windows) * OPENING_SQ_FT;
  const paintableSqFt = Math.max(0, wallSqFt - openingsSqFt);
  const gallonsExact = (paintableSqFt * i.coats) / i.sqFtPerGallon;
  return { wallSqFt, openingsSqFt, paintableSqFt, gallonsExact, gallons: ceilUnits(gallonsExact) };
}

// 2. Concrete ----------------------------------------------------------------------------------

/** Quikrete Concrete Mix No. 1101 data sheet: approximate yield per bag, cubic feet. */
export const CONCRETE_BAG_YIELD_CU_FT: Record<number, number> = {
  40: 0.3,
  50: 0.375,
  60: 0.45,
  80: 0.6,
  90: 0.675,
};

export type ConcreteInput = {
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  bagLb: number;
  wastePct: number;
};

export function concrete(i: ConcreteInput) {
  requirePositive("Length", i.lengthFt);
  requirePositive("Width", i.widthFt);
  requirePositive("Thickness", i.thicknessIn);
  requirePercent("Extra", i.wastePct);
  const bagYield = CONCRETE_BAG_YIELD_CU_FT[i.bagLb];
  if (bagYield === undefined) throw new CalcInputError("Bag size must be 40, 50, 60, 80 or 90 lb.");
  const cuFt = (i.lengthFt * i.widthFt * i.thicknessIn) / 12;
  const cuYd = cuFt / CU_FT_PER_CU_YD;
  const cuFtWithExtra = cuFt * (1 + i.wastePct / 100);
  const bagsExact = cuFtWithExtra / bagYield;
  return { cuFt, cuYd, cuFtWithExtra, bagYield, bagsExact, bags: ceilUnits(bagsExact) };
}

// 3. Tile and 4. Flooring ----------------------------------------------------------------------

/** Lowe's tile calculator and Daltile: buy about 10% extra for cuts and breakage. */
export const TILE_WASTE_PCT = 10;
/** Lowe's flooring guide: 5–7% extra for a standard layout, 10–15% on a diagonal (high end used). */
export const FLOORING_WASTE_PCT = { straight: 7, diagonal: 15 } as const;

export type BoxedFloorInput = { lengthFt: number; widthFt: number; sqFtPerBox: number; wastePct: number };

function boxedFloor(i: BoxedFloorInput) {
  requirePositive("Length", i.lengthFt);
  requirePositive("Width", i.widthFt);
  requirePositive("Coverage per box", i.sqFtPerBox);
  requirePercent("Waste", i.wastePct);
  const areaSqFt = i.lengthFt * i.widthFt;
  const neededSqFt = areaSqFt * (1 + i.wastePct / 100);
  const boxesExact = neededSqFt / i.sqFtPerBox;
  return { areaSqFt, neededSqFt, boxesExact, boxes: ceilUnits(boxesExact) };
}

export const tile = boxedFloor;

export type FlooringInput = BoxedFloorInput;
export const flooring = boxedFloor;

// 5. Mulch and soil ----------------------------------------------------------------------------

export type MulchInput = { lengthFt: number; widthFt: number; depthIn: number; bagCuFt: number };

/** Mississippi State University Extension: 1 cubic yard covers 324 sq ft one inch deep. */
export function mulch(i: MulchInput) {
  requirePositive("Length", i.lengthFt);
  requirePositive("Width", i.widthFt);
  requirePositive("Depth", i.depthIn);
  requirePositive("Bag size", i.bagCuFt);
  const areaSqFt = i.lengthFt * i.widthFt;
  const cuYd = (areaSqFt * i.depthIn) / SQ_FT_PER_CU_YD_PER_INCH;
  const cuFt = cuYd * CU_FT_PER_CU_YD;
  const bagsExact = cuFt / i.bagCuFt;
  return { areaSqFt, cuYd, cuFt, bagsExact, bags: ceilUnits(bagsExact) };
}

// 6. Area --------------------------------------------------------------------------------------

export type AreaInput =
  | { shape: "rectangle"; lengthFt: number; widthFt: number }
  | { shape: "triangle"; baseFt: number; heightFt: number }
  | { shape: "circle"; radiusFt: number };

export function area(i: AreaInput) {
  let sqFt: number;
  if (i.shape === "rectangle") sqFt = requirePositive("Length", i.lengthFt) * requirePositive("Width", i.widthFt);
  else if (i.shape === "triangle") sqFt = 0.5 * requirePositive("Base", i.baseFt) * requirePositive("Height", i.heightFt);
  else if (i.shape === "circle") sqFt = Math.PI * requirePositive("Radius", i.radiusFt) ** 2;
  else throw new CalcInputError("Shape must be rectangle, triangle or circle.");
  return { sqFt, sqYd: sqFt / SQ_FT_PER_SQ_YD, sqM: sqFt * SQ_M_PER_SQ_FT };
}

// 7. Wallpaper ---------------------------------------------------------------------------------

/**
 * Sherwin-Williams estimating guide: usable sq ft per single roll by pattern repeat (inches).
 * The yields already allow for pattern matching and trimming waste.
 */
export const WALLPAPER_YIELD_BANDS = [
  { maxRepeatIn: 6, sqFtPerSingleRoll: 25 },
  { maxRepeatIn: 12, sqFtPerSingleRoll: 22 },
  { maxRepeatIn: 18, sqFtPerSingleRoll: 20 },
  { maxRepeatIn: 23, sqFtPerSingleRoll: 18 },
] as const;

export type WallpaperInput = {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  doors: number;
  windows: number;
  repeatIn: number;
};

export function wallpaper(i: WallpaperInput) {
  requirePositive("Room length", i.lengthFt);
  requirePositive("Room width", i.widthFt);
  requirePositive("Wall height", i.heightFt);
  requireCount("Doors", i.doors);
  requireCount("Windows", i.windows);
  requirePositive("Pattern repeat", i.repeatIn, true);
  const band = WALLPAPER_YIELD_BANDS.find((b) => i.repeatIn <= b.maxRepeatIn);
  if (!band) throw new CalcInputError("For pattern repeats over 23 inches, use the yield printed on the wallpaper label.");
  const wallSqFt = roomWallArea(i.lengthFt, i.widthFt, i.heightFt);
  const netSqFt = Math.max(0, wallSqFt - (i.doors + i.windows) * OPENING_SQ_FT);
  const singleRollsExact = netSqFt / band.sqFtPerSingleRoll;
  const singleRolls = ceilUnits(singleRollsExact);
  return {
    wallSqFt,
    netSqFt,
    sqFtPerSingleRoll: band.sqFtPerSingleRoll,
    singleRollsExact,
    singleRolls,
    doubleRolls: ceilUnits(singleRolls / 2),
  };
}

// 8. Gravel and sand ---------------------------------------------------------------------------

/** Typical gravel weight about 2,600–2,800 lb per cubic yard (supplier weight table); 2,800 lb = 1.4 short tons. */
export const GRAVEL_TONS_PER_CU_YD = 1.4;

export type GravelInput = { lengthFt: number; widthFt: number; depthIn: number; tonsPerCuYd: number };

export function gravel(i: GravelInput) {
  requirePositive("Length", i.lengthFt);
  requirePositive("Width", i.widthFt);
  requirePositive("Depth", i.depthIn);
  requirePositive("Density", i.tonsPerCuYd);
  const areaSqFt = i.lengthFt * i.widthFt;
  const cuYd = (areaSqFt * i.depthIn) / SQ_FT_PER_CU_YD_PER_INCH;
  return { areaSqFt, cuYd, cuFt: cuYd * CU_FT_PER_CU_YD, tons: cuYd * i.tonsPerCuYd };
}

// 9. Deck boards (surface boards only) ---------------------------------------------------------

/** Trex: 3/16 in side-to-side gap between boards. 5.5 in is a common actual board width. */
export const DECK_GAP_IN = 3 / 16;
export const DECK_BOARD_WIDTH_IN = 5.5;

export type DeckingInput = {
  /** Deck dimension running along the boards. */
  deckLengthFt: number;
  /** Deck dimension across the boards. */
  deckWidthFt: number;
  boardWidthIn: number;
  boardLengthFt: number;
  gapIn: number;
  wastePct: number;
};

export function decking(i: DeckingInput) {
  requirePositive("Deck length", i.deckLengthFt);
  requirePositive("Deck width", i.deckWidthFt);
  requirePositive("Board width", i.boardWidthIn);
  requirePositive("Board length", i.boardLengthFt);
  requirePositive("Gap", i.gapIn, true);
  requirePercent("Extra", i.wastePct);
  const rowsExact = (i.deckWidthFt * 12) / (i.boardWidthIn + i.gapIn);
  const rows = ceilUnits(rowsExact);
  const boardsPerRow = ceilUnits(i.deckLengthFt / i.boardLengthFt);
  const boards = ceilUnits(rows * boardsPerRow * (1 + i.wastePct / 100));
  return { rowsExact, rows, boardsPerRow, boards, linearFt: boards * i.boardLengthFt };
}

// 10. Insulation -------------------------------------------------------------------------------

/**
 * Approximate R-value per inch, derived from the U.S. Department of Energy home insulation guide.
 * Shown as a reference only — the calculator uses the R-value per inch printed on the product.
 */
export const INSULATION_R_PER_INCH_REFERENCE = [
  { material: "Fiberglass batts", low: 2.5, high: 3.7 },
  { material: "Loose-fill (fiberglass, cellulose)", low: 2.2, high: 3.75 },
  { material: "Open-cell spray foam", low: 3.6, high: 3.6 },
  { material: "Closed-cell spray foam", low: 6.5, high: 6.5 },
  { material: "Expanded polystyrene (EPS) board", low: 3.8, high: 4.4 },
  { material: "Extruded polystyrene (XPS) board", low: 5, high: 5 },
  { material: "Polyisocyanurate (polyiso) board", low: 6.5, high: 6.5 },
] as const;

export type InsulationInput = { areaSqFt: number; targetR: number; rPerInch: number; sqFtPerPackage: number };

export function insulation(i: InsulationInput) {
  requirePositive("Area", i.areaSqFt);
  requirePositive("Target R-value", i.targetR);
  requirePositive("R-value per inch", i.rPerInch);
  requirePositive("Coverage per package", i.sqFtPerPackage);
  const thicknessIn = i.targetR / i.rPerInch;
  const packagesExact = i.areaSqFt / i.sqFtPerPackage;
  return { thicknessIn, packagesExact, packages: ceilUnits(packagesExact) };
}
