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

Phase 2: home page look and feel. Photography, logo and certification marks come from the client WordPress media library (`src/assets/media`, see its README). No vector logo exists yet. Figures marked `confirm` in `src/data/site.ts` need a fact check with the client.

## Sanity CMS (Mahela Cares first)

1. Create a project at sanity.io/manage; note the Project ID and dataset name (`production`).
2. `cp .env.example .env` and set `SANITY_PROJECT_ID` / `SANITY_DATASET`. `cp studio/.env.example studio/.env` and set the same two values.
3. Studio: `cd studio && npm install && npx sanity login && npm run seed && npm run dev` (opens at localhost:3333). `npm run seed` loads the current approved Cares copy.
4. Site: `npm run dev`. Anything empty in Sanity falls back to the built-in copy; with no `.env` the site is unchanged.
