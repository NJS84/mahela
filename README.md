# Mahela Group website

Rebuild of [mahela.co.za](https://www.mahela.co.za) by Web Guys.

- **Stack:** Astro 7, TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText) + Lenis
- **Hosting:** Cloudflare Pages (static output)
- **Content:** `src/data/site.ts` for now; a headless CMS (Sanity proposed) comes in Phase 3.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks, then builds to dist/
```

## Cloudflare Pages settings

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 22 (set `NODE_VERSION=22`) |

## Status

Phase 2: home page look and feel. Photography and the logo are placeholders (`.ph` blocks and `Logo.astro`) until Mahela supplies final assets. Figures marked `confirm` in `src/data/site.ts` need a fact check with the client.
