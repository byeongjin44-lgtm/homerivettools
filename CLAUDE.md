# CLAUDE.md

Guidance for Claude Code (and any other agent) working in this repository.

The site owner reads Korean only. Talk to them in Korean; code, commands and file names may stay in English.

## What this project is

HomeRivet (https://homerivettools.com) is an English-language, US-focused website of home and garden
material calculators, plus a blog of explanatory guides that are written by the automated engine in
`github.com/byeongjin44-lgtm/blog-engine` and published only after the owner approves each post on Telegram.
Current calculators (10): paint, concrete, tile, flooring, mulch & soil, square footage, wallpaper,
gravel & sand, deck boards, insulation. It is a sister site of DevRivet (`byeongjin44-lgtm/devrivet`) and
uses the same stack: Next.js static export → Cloudflare Pages, Google AdSense, Cloudflare Web Analytics.

## LOCKED content risk rules — 사용자 승인 없이 변경 금지 (never change without the owner's explicit approval)

These five rules were agreed with the owner before the project started. Do not remove, weaken, bypass or
"temporarily" disable any of them, their code, or their tests without the owner's explicit approval in
Korean. If a task seems to require it, stop and ask first.

1. **Calculations are code, not AI.** Every formula lives in `src/lib/calc/formulas.ts`, with constants
   taken from manufacturer or public-agency sources, and is pinned by the worked examples in
   `src/lib/calc/formulas.test.ts`. Never edit an expected value in that test to make it pass.
2. **Numbers in posts come from the calculator code.** The engine computes them with `scripts/calc.mts`
   before writing. A post's `calculations` field is re-run at build time and every headline result must
   appear in the post text (`validatePost` in `src/lib/blog.ts`); a mismatch fails the build.
3. **Material quantities only.** No electrical, structural/load, gas, roofing/work-at-height, plumbing
   installation, hazardous-material or building-code content. The list is `FORBIDDEN_TOPICS` in
   `src/lib/content-policy.ts`, enforced on every post and on calculator page text, and guarded by
   `src/lib/content-policy.test.ts`. Adding phrases is fine; removing them needs approval.
4. **Cite sources and point to the label.** Every calculator and every post lists
   https sources, and every post must tell readers to check the manufacturer's label.
5. **Formula table for the owner.** The formulas and sources are summarised in Korean in the claude.ai doc
   "사이트 B 계산기 공식·근거표". Any approved formula change must be reflected there too.

The approved formula table also left four open decisions; until the owner answers, keep these defaults:
concrete extra 0% (user-adjustable), deck board extra 0% (user-adjustable), gravel 1.4 tons per cubic yard
(user-adjustable), US units only.

## Other hard rules

- **Calculator set is locked at 10** until production traffic data shows real demand. Don't add
  calculators or features before then; flag this rule if asked.
- Home/garden material quantity calculators only — no developer tools, finance, health or other categories.
- No auth, no accounts, no database, no backend/API, no AI features in the calculators. Inputs stay in the browser.
- No admin dashboard, payments, heavy state management or UI libraries. No placeholder nav items.
- No premature architecture (no i18n, no metric/imperial system until the owner decides to support metric).

## Working conventions

- Formulas: `src/lib/calc/formulas.ts` (pure functions, sources in comments). Fields, defaults and result
  rows: `src/lib/calc/registry.ts`. The website form (`src/components/CalculatorTool.tsx`), the tests, the
  build-time post check and `scripts/calc.mts` all go through the registry, so they cannot disagree.
- Files in `src/lib/calc/` import each other with explicit `.ts` extensions and must not use `@/` imports,
  enums or namespaces, so Node can run them directly (`npm run calc -- '<json>'`).
- Field defaults are the worked examples from the approved table; each page's "Example" section is
  computed from them at build time.
- Site identity (`SITE_NAME`, `SITE_URL`, `CONTACT_EMAIL`, `ADSENSE_CLIENT`) and the tool registry with SEO
  text and sources live in `src/lib/site-config.ts`. Page explanations live in `src/lib/calculator-content.ts`
  and must describe exactly what the formula code does.
- All calculator pages are rendered by `src/app/[calculator]/page.tsx` + `ToolPageLayout`.
- **Blog**: posts are JSON in `content/blog/<slug>.json`, validated by `src/lib/blog.ts` (required
  `sources`, optional `relatedTool` and `calculations`). Future-dated posts stay hidden until a later build.
- **Advertising**: Google AdSense only (`ADSENSE_CLIENT`, same account as DevRivet), plain `<script>` in
  `layout.tsx`, `/ads.txt`, Privacy page Advertising section. Auto ads + AdSense consent message.
- **Analytics**: Cloudflare Web Analytics automatic setup only; never add the manual beacon, GA or GTM.
- `CONTACT_EMAIL` is receive-only through Cloudflare Email Routing.

## After any change

Run, and fix failures before considering the task done (CI runs the same on every push):

```bash
npm run lint
npm run test
npm run build
```

## Before upgrading Next.js

Check the official Next.js security advisories / release notes for the target version first.
