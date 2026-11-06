import type { APIRoute } from 'astro';
import { allRoutes } from '../lib/routes';
import { posts } from '../data/pages';

export const GET: APIRoute = ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const lastmod = (r: string) => posts.find((p) => r === `/news/${p.slug}`)?.date ?? today;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes()
  .map((r) => `  <url><loc>${base}${r === '/' ? '/' : r}</loc><lastmod>${lastmod(r)}</lastmod></url>`)
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
