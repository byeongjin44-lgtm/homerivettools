# HomeRivet

Free material calculators for home and garden projects — https://homerivettools.com

Next.js static export deployed to Cloudflare Pages (build command `npm run build`, output directory `out`).

```bash
npm ci
npm run dev      # local preview
npm run test     # formula, content-policy and blog tests
npm run calc -- '{"calculator":"tile-calculator","input":{"lengthFt":10,"widthFt":12}}'
```

See `CLAUDE.md` for the locked content rules.
