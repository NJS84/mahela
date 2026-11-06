import { posts, produceDetail } from '../data/pages';

/** Every indexable route, used by the sitemap and llms.txt. */
export function allRoutes() {
  const fixed = ['/', '/about-us', '/about-us/leadership', '/produce', '/packhouses', '/export', '/mahela-cares', '/mahela-game', '/news', '/contact-us', '/legal'];
  return [...fixed, ...Object.keys(produceDetail).map((s) => `/produce/${s}`), ...posts.map((p) => `/news/${p.slug}`)];
}
