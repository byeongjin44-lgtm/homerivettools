import { ImageResponse } from "next/og";
import { getAllPosts } from "@/lib/blog";
import { PIN_SIZE, pinAnswers } from "@/lib/pin";
import { SITE_NAME, SITE_URL, TOOLS } from "@/lib/site-config";

// Tall Pinterest images, written to out/pin/<key>.png at build time: one per calculator
// ("<slug>") and one per published guide ("blog-<slug>"). Numbers come from the calculator code.
export const dynamic = "force-static";
export const dynamicParams = false;

type Card = { label: string; title: string; lines: string[]; footer: string };

function cards(): Record<string, Card> {
  const all: Record<string, Card> = {};
  for (const t of TOOLS) {
    all[t.slug] = { label: "Free calculator", title: t.name, lines: [t.shortDescription], footer: "No sign-up · US units" };
  }
  for (const p of getAllPosts()) {
    const tool = TOOLS.find((t) => t.slug === p.relatedTool);
    const answers = pinAnswers(p);
    all[`blog-${p.slug}`] = {
      label: "Quick answer",
      title: p.title,
      lines: answers.length ? answers : [p.description],
      footer: tool ? `Try your own size: free ${tool.name}` : "Free home project calculators",
    };
  }
  return all;
}

export function generateStaticParams() {
  return Object.keys(cards()).map((key) => ({ image: `${key}.png` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const key = (await params).image.replace(/\.png$/, "");
  const card = cards()[key];
  if (!card) return new Response("Not found", { status: 404 });
  const domain = SITE_URL.replace(/^https:\/\//, "");
  const titleSize = card.title.length > 70 ? 64 : card.title.length > 45 ? 76 : 88;
  const lineSize = card.lines.some((l) => l.length > 40) ? 44 : 56;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "48px 64px", background: "#065f46" }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="6" fill="#ecfdf5" />
            <path
              d="M7 16 L16 8 L25 16 M10 14 V24 H22 V14"
              fill="none"
              stroke="#065f46"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#ffffff" }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", gap: 48, padding: "56px 64px" }}>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#065f46", textTransform: "uppercase", letterSpacing: 2 }}>
            {card.label}
          </div>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, color: "#18181b", lineHeight: 1.1 }}>{card.title}</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              padding: "40px 44px",
              borderRadius: 24,
              background: "#ecfdf5",
              border: "4px solid #065f46",
            }}
          >
            {card.lines.map((line) => (
              <div key={line} style={{ display: "flex", fontSize: lineSize, fontWeight: 700, color: "#065f46", lineHeight: 1.2 }}>
                {line}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#52525b", lineHeight: 1.3 }}>{card.footer}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "36px 64px", background: "#18181b", fontSize: 40, fontWeight: 700, color: "#ffffff" }}>
          {domain}
        </div>
      </div>
    ),
    PIN_SIZE,
  );
}
