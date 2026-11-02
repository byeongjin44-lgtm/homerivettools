import { adsTxt } from "@/lib/site-config";

// Required by `output: "export"` so ads.txt is generated once at build time.
export const dynamic = "force-static";

export function GET() {
  return new Response(adsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
