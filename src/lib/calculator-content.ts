/**
 * Explanatory content for each calculator page. The "how it works" steps must describe exactly
 * what `src/lib/calc/formulas.ts` does — the worked example on each page is computed live from
 * the registry, so it can never drift from the formula.
 */
export type CalculatorContent = {
  howItWorks: string[];
  tips: string[];
  faq: { q: string; a: string }[];
  /** What the calculator deliberately does not cover. */
  scope?: string;
};

export const CALCULATOR_CONTENT: Record<string, CalculatorContent> = {
  "paint-calculator": {
    howItWorks: [
      "Wall area = (room length + room width) × 2 × wall height.",
      "Each door and each window is deducted as 20 sq ft, the standard allowance in Sherwin-Williams' estimating guide.",
      "Gallons = paintable area × number of coats ÷ coverage per gallon, rounded up to a whole gallon.",
      "The default coverage is 350 sq ft per gallon, the low end of the 350–400 sq ft range Sherwin-Williams gives, so you are less likely to run short.",
    ],
    tips: [
      "Rough, porous or textured walls and big color changes use more paint than the label suggests.",
      "Check the coverage printed on your paint can and enter it if it differs from 350 sq ft.",
      "Ceilings and trim are not included — measure them separately.",
    ],
    faq: [
      {
        q: "Should I count one coat or two?",
        a: "Two coats is the common choice for repainting, and it is the default here. If your product label says one coat covers, you can change it.",
      },
      {
        q: "Why round up?",
        a: "Paint is sold in whole cans, and buying the same batch at once keeps the color consistent. A partly used gallon is better than a second trip.",
      },
    ],
  },
  "concrete-calculator": {
    howItWorks: [
      "Volume in cubic feet = length × width × thickness in inches ÷ 12.",
      "Cubic yards = cubic feet ÷ 27 — the unit ready-mix suppliers sell by.",
      "Bags = cubic feet ÷ the yield of one bag, rounded up. Yields are from the Quikrete Concrete Mix data sheet: 40 lb 0.30, 50 lb 0.375, 60 lb 0.45, 80 lb 0.60 and 90 lb 0.675 cu ft.",
      "An optional extra percentage adds a margin for spillage and uneven ground. It is 0% unless you set it.",
    ],
    tips: [
      "Measure thickness in several places; a slightly deeper base adds up quickly.",
      "Yields differ between products — check the yield printed on the bag you buy.",
      "For large pours, compare the bag count with ordering ready-mix by the cubic yard.",
    ],
    faq: [
      {
        q: "How many 80 lb bags make a cubic yard?",
        a: "27 cu ft ÷ 0.60 cu ft per bag = 45 bags of 80 lb mix per cubic yard.",
      },
      {
        q: "Does this cover rebar or slab design?",
        a: "No. This calculator estimates material quantity only. Reinforcement, base preparation and slab design are outside its scope.",
      },
    ],
    scope: "Material quantity only — not reinforcement or slab design.",
  },
  "tile-calculator": {
    howItWorks: [
      "Floor area = length × width.",
      "Tile needed = floor area × 1.10, adding the 10% extra that Lowe's and Daltile recommend for cuts and breakage.",
      "Boxes = tile needed ÷ coverage per box (printed on the box), rounded up.",
    ],
    tips: [
      "Use more extra for diagonal or herringbone layouts and for large tiles in small rooms.",
      "Daltile suggests keeping leftover tile as attic stock for future repairs from the same dye lot.",
      "Check that every box has the same shade and lot number.",
    ],
    faq: [
      {
        q: "Why add 10%?",
        a: "Edge tiles are cut and some break. Extra tile from the same lot also means repairs will match later.",
      },
      {
        q: "Can I use this for wall tile?",
        a: "Yes — enter the wall's width and height instead of the floor's length and width.",
      },
    ],
  },
  "flooring-calculator": {
    howItWorks: [
      "Floor area = length × width.",
      "Flooring needed = floor area × (1 + extra). Lowe's recommends 5–7% extra for a standard layout and 10–15% for a diagonal one; this calculator uses the high end of each, 7% and 15%.",
      "Boxes = flooring needed ÷ coverage per box, rounded up.",
    ],
    tips: [
      "Choose a custom percentage for character-grade boards, which have more pieces you will cut out.",
      "Add up each room's area when the floor runs through several rooms.",
      "Check the installation instructions on the box for the manufacturer's own overage advice.",
    ],
    faq: [
      {
        q: "Is the extra for a diagonal layout really double?",
        a: "Diagonal layouts create a cut at every wall, so more boards are trimmed. That is why the recommended extra rises to 10–15%.",
      },
    ],
  },
  "mulch-calculator": {
    howItWorks: [
      "Bed area = length × width.",
      "Cubic yards = area × depth in inches ÷ 324. One cubic yard covers 324 sq ft one inch deep, as Mississippi State University Extension explains (27 cu ft × 12 = 324).",
      "Bags = cubic yards × 27 ÷ bag size in cubic feet, rounded up.",
    ],
    tips: [
      "Mulch settles, so measure depth after raking it level.",
      "Bulk delivery by the yard is usually cheaper than bags for large beds.",
      "The same formula works for topsoil and compost.",
    ],
    faq: [
      {
        q: "What depth should I enter?",
        a: "Enter the finished depth you want after spreading. For the right depth for your plants, check your local extension service.",
      },
    ],
  },
  "square-footage-calculator": {
    howItWorks: [
      "Rectangle or square: length × width.",
      "Triangle: ½ × base × height.",
      "Circle: π × radius².",
      "Square yards = square feet ÷ 9; square meters = square feet × 0.0929.",
    ],
    tips: [
      "Split an L-shaped room into two rectangles and add the results.",
      "Measure to the nearest inch and convert: 6 inches = 0.5 ft.",
    ],
    faq: [
      {
        q: "How do I convert inches to feet?",
        a: "Divide by 12. For example, 10 ft 6 in is 10.5 ft.",
      },
    ],
  },
  "wallpaper-calculator": {
    howItWorks: [
      "Wall area = (room length + room width) × 2 × wall height.",
      "Each door and window is deducted as 20 sq ft.",
      "Single rolls = wall area ÷ usable area per single roll, rounded up. Following Sherwin-Williams' estimating guide, a single roll gives 25 sq ft for repeats up to 6 in, 22 sq ft up to 12 in, 20 sq ft up to 18 in and 18 sq ft up to 23 in — figures that already allow for matching the pattern.",
      "Double rolls = single rolls ÷ 2, rounded up, since most wallpaper is sold in double rolls.",
    ],
    tips: [
      "Sherwin-Williams suggests buying one extra roll for repairs.",
      "Make sure every roll has the same run or lot number.",
      "For repeats over 23 inches, use the yield printed on the wallpaper label.",
    ],
    faq: [
      {
        q: "Where do I find the pattern repeat?",
        a: "It is printed on the label or product page, usually in inches. Use 0 for a plain or random-match paper.",
      },
    ],
  },
  "gravel-calculator": {
    howItWorks: [
      "Area = length × width.",
      "Cubic yards = area × depth in inches ÷ 324.",
      "Tons = cubic yards × weight per cubic yard. The default is 1.4 tons (2,800 lb); supplier weight tables list most gravels at about 2,600–2,800 lb per cubic yard and sand at 2,600–2,900 lb.",
    ],
    tips: [
      "Weight depends on the stone type and moisture, so ask your supplier for the figure for the exact material.",
      "Suppliers sell by the ton or by the yard — compare both prices.",
    ],
    faq: [
      {
        q: "How many tons is a cubic yard of gravel?",
        a: "Roughly 1.3–1.4 tons for typical gravel, but it varies by material. Use your supplier's figure when you have it.",
      },
    ],
  },
  "deck-board-calculator": {
    howItWorks: [
      "Rows of boards = deck width in inches ÷ (actual board width + gap), rounded up.",
      "Boards per row = deck length ÷ board length, rounded up.",
      "Boards = rows × boards per row, plus any extra percentage you add.",
      "The default gap is 3/16 in between boards, as Trex recommends for its composite decking.",
    ],
    tips: [
      "Use the actual board width from the product page — a nominal 6 in board is often 5.5 in wide.",
      "Pick a board length that divides your deck length evenly to cut less waste.",
      "Follow your board manufacturer's gap and fastening instructions.",
    ],
    faq: [
      {
        q: "Does this include the deck frame?",
        a: "No. It counts surface boards only. The frame underneath is structural and outside the scope of this calculator.",
      },
    ],
    scope: "Surface boards only — not the deck frame or its supports.",
  },
  "insulation-calculator": {
    howItWorks: [
      "Thickness = target R-value ÷ the R-value per inch printed on your product.",
      "Packages = area ÷ coverage per package (printed on the package for that thickness), rounded up.",
      "The reference table below shows approximate R-values per inch from U.S. Department of Energy data. Values vary by product, so always use the product label.",
    ],
    tips: [
      "Recommended R-values depend on your climate zone and where the insulation goes.",
      "Compressed insulation loses R-value, so do not squeeze batts into a thinner space.",
    ],
    faq: [
      {
        q: "Why does R-value per inch vary so much?",
        a: "Density, material and installation all change it. Loose-fill settles over time and batts lose R-value when compressed.",
      },
    ],
  },
};
