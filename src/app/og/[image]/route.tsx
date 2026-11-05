import { ImageResponse } from "next/og";
import { getAllPosts } from "@/lib/blog";
import { OG_SIZE } from "@/lib/og";
import { SITE_NAME, SITE_URL, TOOLS } from "@/lib/site-config";

// Share-preview images, written to out/og/<key>.png at build time (keys come from `ogImageKey`).
export const dynamic = "force-static";
export const dynamicParams = false;

type Card = { label: string; title: string; subtitle: string };

function cards(): Record<string, Card> {
  const all: Record<string, Card> = {
    home: {
      label: "Free calculators",
      title: "How much material do you need?",
      subtitle: `${TOOLS.length} home & garden calculators: paint, concrete, tile, flooring, mulch and more.`,
    },
  };
  for (const t of TOOLS) all[t.slug] = { label: "Calculator", title: t.name, subtitle: t.shortDescription };
  for (const p of getAllPosts()) {
    const tool = TOOLS.find((t) => t.slug === p.relatedTool);
    all[`blog-${p.slug}`] = { label: "Guide", title: p.title, subtitle: tool ? `With the free ${tool.name}` : SITE_NAME };
  }
  return all;
}

export function generateStaticParams() {
  return Object.keys(cards()).map((key) => ({ image: `${key}.png` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const key = (await params).image.replace(/\.png$/, "");
  const card = cards()[key] ?? cards().home;
  const domain = SITE_URL.replace(/^https:\/\//, "");
  const titleSize = card.title.length > 60 ? 54 : card.title.length > 35 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#ffffff",
          borderBottom: "16px solid #065f46",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="6" fill="#065f46" />
            <path
              d="M7 16 L16 8 L25 16 M10 14 V24 H22 V14"
              fill="none"
              stroke="#ecfdf5"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#18181b" }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#065f46", textTransform: "uppercase", letterSpacing: 2 }}>
            {card.label}
          </div>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, color: "#18181b", lineHeight: 1.1 }}>{card.title}</div>
          <div style={{ display: "flex", fontSize: 30, color: "#52525b", lineHeight: 1.3 }}>{card.subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#71717a" }}>{domain}</div>
      </div>
    ),
    OG_SIZE,
  );
}
