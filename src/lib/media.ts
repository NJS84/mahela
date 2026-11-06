import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>('../assets/media/**/*.{jpg,jpeg,png,webp}', { eager: true });

/** Look up an image in src/assets/media by its path inside that folder, e.g. 'farms/dsc-1739.jpg'. */
export function media(path: string): ImageMetadata {
  const hit = all[`../assets/media/${path}`];
  if (!hit) throw new Error(`Missing media: ${path}`);
  return hit.default;
}

export function hasMedia(path: string) {
  return Boolean(all[`../assets/media/${path}`]);
}
