import type { APIRoute } from 'astro';
import { site, produce } from '../data/site';
import { about, produceDetail, packhouses, exportPage, cares, game, posts } from '../data/pages';

/** llms.txt: a plain-text brief for AI assistants and answer engines. */
export const GET: APIRoute = () => {
  const u = (p: string) => `${site.url}${p}`;
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Key facts',
    '- Founded: 1942, at The Junction outside Letsitele, Mopani district, Limpopo, South Africa',
    `- ${about.lead}`,
    '- Certification: GlobalGAP certified since 2003; SIZA accredited; PPECB inspectors on-site full-time in season',
    `- Packhouses: ${packhouses.sites.map((s) => `${s.name} (${s.place}; ${s.packs.toLowerCase()})`).join('; ')}; combined 20 000 m²; up to 1 200 tons a day; season end of March to end of September`,
    `- Brands: ${exportPage.brands.join(', ')}`,
    `- Export markets: ${exportPage.markets.map((m) => m.name).join(', ')}`,
    `- Produce: ${produce.map((p) => p.name).join(', ')}; certified nursery trees`,
    `- Contact: ${site.phone}, ${site.email}, ${site.address.street}, ${site.address.locality}, ${site.address.postalCode}`,
    '',
    '## Pages',
    `- [About us](${u('/about-us')}): history since 1942, divisions and values`,
    `- [Board of directors](${u('/about-us/leadership')})`,
    `- [Produce](${u('/produce')}): overview and nursery`,
    ...Object.entries(produceDetail).map(([slug, p]) => `- [${p.title}](${u(`/produce/${slug}`)}): ${p.description}`),
    `- [Packhouses](${u('/packhouses')}): ${packhouses.lead}`,
    `- [Export](${u('/export')}): markets, compliance, importer FAQ`,
    `- [Mahela Cares](${u('/mahela-cares')}): ${cares.lead}`,
    `- [Mahela Game](${u('/mahela-game')}): ${game.lead}`,
    `- [News](${u('/news')})`,
    `- [Contact](${u('/contact-us')})`,
    '',
    '## Importer FAQ',
    ...exportPage.faq.flatMap((f) => [`### ${f.q}`, f.a, '']),
    '## Recent news',
    ...[...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map((p) => `- [${p.title}](${u(`/news/${p.slug}`)}) (${p.date}${p.source ? `, ${p.source}` : ''})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
