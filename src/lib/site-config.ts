export const SITE_NAME = "HomeRivet";
export const SITE_URL = "https://homerivettools.com";
export const CONTACT_EMAIL = "contact@homerivettools.com";
/**
 * Google AdSense publisher ID ("ca-pub-" + 16 digits), or null while the site runs no ads.
 * Same AdSense account as DevRivet. Setting it loads the AdSense script on every page (Auto ads +
 * the AdSense consent message, configured in the AdSense dashboard), fills /ads.txt, and shows the
 * Advertising section of the Privacy page. Update that page's "Last updated" date when changing.
 */
/**
 * Pinterest website claim: the code from Pinterest (Settings → Claimed accounts → Claim website →
 * "Add HTML tag"), i.e. the content of its p:domain_verify meta tag. null = no tag.
 */
export const PINTEREST_DOMAIN_VERIFY: string | null = "82490c7284f04838fe240d90f6c0ac3a";

export const ADSENSE_CLIENT: string | null = "ca-pub-5531085038115326";

/** Contents of /ads.txt for the configured AdSense account. */
export function adsTxt(client: string | null = ADSENSE_CLIENT): string {
  if (!client) return "# This site does not run advertising yet.\n";
  if (!/^ca-pub-\d{16}$/.test(client)) throw new Error(`ADSENSE_CLIENT must look like ca-pub-0000000000000000, got ${client}`);
  // f08c47fec0942fa0 is Google's certification authority ID, the same for every AdSense publisher.
  return `google.com, ${client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`;
}

export const SITE_TITLE = `${SITE_NAME} — Free Home Project Material Calculators`;
export const SITE_DESCRIPTION =
  "10 free calculators for home and garden projects: paint, concrete, tile, flooring, mulch, square footage, wallpaper, gravel, deck boards and insulation. Formulas from manufacturer data.";

export const TOOL_CATEGORIES = ["Walls & Floors", "Concrete & Landscaping", "Deck & Insulation", "Measuring"] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export type ToolSource = { title: string; url: string };

export type ToolDefinition = {
  /** Also the calculator id in `src/lib/calc/registry.ts`. */
  slug: string;
  category: ToolCategory;
  path: string;
  name: string;
  shortDescription: string;
  title: string;
  metaDescription: string;
  /** Slugs of genuinely related tools, linked from the bottom of this tool's page. */
  related: string[];
  /** Manufacturer or public-agency sources of the formula's figures, cited on the page. */
  sources: ToolSource[];
};

const SW_PAINT = { title: "Sherwin-Williams paint calculator", url: "https://www.sherwin-williams.com/en-us/color/color-tools/paint-calculator" };
const SW_ESTIMATE = {
  title: "Sherwin-Williams: How to estimate how much wallpaper you need",
  url: "https://www.sherwin-williams.com/homeowners/how-to/wallpapering-how-tos/sw-article-dir-howtoestimate",
};

const tool = (t: Omit<ToolDefinition, "path">): ToolDefinition => ({ ...t, path: `/${t.slug}` });

export const TOOLS: ToolDefinition[] = [
  tool({
    slug: "paint-calculator",
    category: "Walls & Floors",
    name: "Paint Calculator",
    shortDescription: "How many gallons of paint a room needs, after doors and windows.",
    title: `Paint Calculator: How Many Gallons for a Room? — ${SITE_NAME}`,
    metaDescription:
      "Estimate how many gallons of paint you need for a room. Enter the room size, doors, windows and coats; the calculator deducts openings and rounds up to whole gallons.",
    related: ["wallpaper-calculator", "square-footage-calculator"],
    sources: [SW_PAINT, SW_ESTIMATE],
  }),
  tool({
    slug: "concrete-calculator",
    category: "Concrete & Landscaping",
    name: "Concrete Calculator",
    shortDescription: "Cubic yards and 40–90 lb bags of concrete mix for a slab.",
    title: `Concrete Calculator: Cubic Yards & Bags (40–90 lb) — ${SITE_NAME}`,
    metaDescription:
      "Calculate the concrete for a slab or pad in cubic feet, cubic yards and bags of mix. Bag yields from the Quikrete data sheet for 40, 50, 60, 80 and 90 lb bags.",
    related: ["gravel-calculator", "square-footage-calculator"],
    sources: [
      { title: "Quikrete Concrete Mix No. 1101 data sheet", url: "https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf" },
    ],
  }),
  tool({
    slug: "tile-calculator",
    category: "Walls & Floors",
    name: "Tile Calculator",
    shortDescription: "Boxes of floor tile to buy, with 10% extra for cuts.",
    title: `Tile Calculator: How Many Boxes of Tile? — ${SITE_NAME}`,
    metaDescription:
      "Work out how many boxes of tile to buy for a floor. Adds the recommended 10% extra for cuts and breakage and rounds up to whole boxes.",
    related: ["flooring-calculator", "square-footage-calculator"],
    sources: [
      { title: "Lowe's tile flooring calculator", url: "https://www.lowes.com/n/calculators/tile-floor-calculator" },
      { title: "Daltile tile & stone FAQs", url: "https://www.daltile.com/how-to/faqs" },
    ],
  }),
  tool({
    slug: "flooring-calculator",
    category: "Walls & Floors",
    name: "Flooring Calculator",
    shortDescription: "Boxes of hardwood, laminate or vinyl plank for a room.",
    title: `Flooring Calculator: Boxes of Laminate, Hardwood & LVP — ${SITE_NAME}`,
    metaDescription:
      "Calculate how many boxes of laminate, hardwood or vinyl plank flooring you need, with 7% extra for a straight layout or 15% for a diagonal one.",
    related: ["tile-calculator", "square-footage-calculator"],
    sources: [
      {
        title: "Lowe's: How to calculate the correct footage when purchasing flooring",
        url: "https://pdf.lowes.com/productdocuments/3f70b1c9-8ab7-4125-a2e7-9a3d080d2861/08130541.pdf",
      },
    ],
  }),
  tool({
    slug: "mulch-calculator",
    category: "Concrete & Landscaping",
    name: "Mulch & Soil Calculator",
    shortDescription: "Cubic yards or bags of mulch, topsoil or compost for a bed.",
    title: `Mulch Calculator: Cubic Yards & Bags for a Garden Bed — ${SITE_NAME}`,
    metaDescription:
      "Find how much mulch, topsoil or compost a garden bed needs in cubic yards or 1.5, 2 and 3 cu ft bags, using the extension-service rule of 324 sq ft per yard per inch.",
    related: ["gravel-calculator", "square-footage-calculator"],
    sources: [
      {
        title: "Mississippi State University Extension: Calculate mulch, soil needs for plant beds",
        url: "https://extension.msstate.edu/news/southern-gardening/1997/calculate-mulch-soil-needs-for-plant-beds",
      },
    ],
  }),
  tool({
    slug: "square-footage-calculator",
    category: "Measuring",
    name: "Square Footage Calculator",
    shortDescription: "Area of a rectangle, triangle or circle in sq ft, sq yd and m².",
    title: `Square Footage Calculator (Rectangle, Triangle, Circle) — ${SITE_NAME}`,
    metaDescription:
      "Calculate square footage for rectangles, triangles and circles, with the result in square feet, square yards and square meters. Add up rooms for any project.",
    related: ["paint-calculator", "flooring-calculator"],
    sources: [
      {
        title: "NIST Guide to the SI, Appendix B.8: Factors for units listed alphabetically",
        url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8",
      },
    ],
  }),
  tool({
    slug: "wallpaper-calculator",
    category: "Walls & Floors",
    name: "Wallpaper Calculator",
    shortDescription: "Single and double rolls of wallpaper, adjusted for pattern repeat.",
    title: `Wallpaper Calculator: How Many Rolls? (Pattern Repeat) — ${SITE_NAME}`,
    metaDescription:
      "Estimate how many single or double rolls of wallpaper a room needs. Deducts doors and windows and uses usable-yield figures that allow for the pattern repeat.",
    related: ["paint-calculator", "square-footage-calculator"],
    sources: [SW_ESTIMATE],
  }),
  tool({
    slug: "gravel-calculator",
    category: "Concrete & Landscaping",
    name: "Gravel & Sand Calculator",
    shortDescription: "Cubic yards and tons of gravel, crushed stone or sand.",
    title: `Gravel Calculator: Cubic Yards & Tons — ${SITE_NAME}`,
    metaDescription:
      "Calculate gravel, crushed stone or sand in cubic yards and tons for a driveway, path or patio base. Adjustable weight per cubic yard for your supplier's material.",
    related: ["mulch-calculator", "concrete-calculator"],
    sources: [{ title: "Mulch Pros: Material weight and coverage", url: "https://mulchpros.com/material-weight-and-coverage/" }],
  }),
  tool({
    slug: "deck-board-calculator",
    category: "Deck & Insulation",
    name: "Deck Board Calculator",
    shortDescription: "Number of surface deck boards, with the recommended gap.",
    title: `Deck Board Calculator: How Many Boards? — ${SITE_NAME}`,
    metaDescription:
      "Count the surface boards for a deck from its size, the actual board width and length, and the 3/16 in gap recommended for composite decking.",
    related: ["square-footage-calculator", "concrete-calculator"],
    sources: [{ title: "Trex: How to space deck boards", url: "https://www.trex.com/deck-ideas/how-to-space-deck-boards/" }],
  }),
  tool({
    slug: "insulation-calculator",
    category: "Deck & Insulation",
    name: "Insulation Calculator",
    shortDescription: "Thickness for a target R-value and packages to buy.",
    title: `Insulation Calculator: R-Value, Thickness & Packages — ${SITE_NAME}`,
    metaDescription:
      "Find the insulation thickness that reaches a target R-value and how many packages to buy, with an R-value-per-inch reference table based on U.S. Department of Energy data.",
    related: ["square-footage-calculator"],
    sources: [
      { title: "U.S. Department of Energy: Guide to home insulation", url: "https://www.energy.gov/sites/prod/files/guide_to_home_insulation.pdf" },
    ],
  }),
];

/** Related tools for the tool at `path`, resolved from the registry (unknown slugs are dropped). */
export function getRelatedTools(path: string): ToolDefinition[] {
  const t = TOOLS.find((x) => x.path === path);
  if (!t) return [];
  return t.related
    .map((slug) => TOOLS.find((x) => x.slug === slug))
    .filter((related): related is ToolDefinition => related !== undefined && related.slug !== t.slug);
}

export const TOOL_GROUPS = TOOL_CATEGORIES.map((category) => ({
  category,
  tools: TOOLS.filter((t) => t.category === category),
}));
