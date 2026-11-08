/**
 * Sanity CMS connection.
 *
 * The site reads published content from Sanity at build time (and on every request in `npm run dev`).
 * Sanity is optional: with no SANITY_PROJECT_ID in .env, or if Sanity cannot be reached, every page
 * falls back to the approved copy in src/data, so the site always builds and looks the same.
 *
 * .env (never commit it):
 *   SANITY_PROJECT_ID=xxxxxxxx
 *   SANITY_DATASET=production
 *   SANITY_READ_TOKEN=...   (optional; only needed if the dataset is private)
 */
import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = import.meta.env.SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.SANITY_DATASET as string | undefined) || 'production';
const token = import.meta.env.SANITY_READ_TOKEN as string | undefined;

export const sanityEnabled = Boolean(projectId);

const client: SanityClient | null = projectId
  ? createClient({ projectId, dataset, token, apiVersion: '2025-10-01', useCdn: false, perspective: 'published' })
  : null;

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

/** Run a GROQ query; returns null (never throws) when Sanity is off or unreachable. */
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params);
  } catch (err) {
    console.warn(`[sanity] query failed, using local copy instead: ${(err as Error).message}`);
    return null;
  }
}

export type SanityImage = { asset?: { _ref?: string }; hotspot?: { x: number; y: number }; alt?: string } | null | undefined;

/**
 * A responsive Sanity image (served from cdn.sanity.io, auto WebP/AVIF), or null when no image is set.
 * `position` follows the editor's hotspot so object-position matches what they chose in the Studio.
 */
export function sanityImage(img: SanityImage, widths = [768, 1280, 1920, 2400]) {
  if (!builder || !img?.asset?._ref) return null;
  const base = builder.image(img).auto('format').fit('max').quality(82);
  return {
    src: base.width(widths[Math.min(1, widths.length - 1)]!).url(),
    srcset: widths.map((w) => `${base.width(w).url()} ${w}w`).join(', '),
    position: img.hotspot ? `${Math.round(img.hotspot.x * 100)}% ${Math.round(img.hotspot.y * 100)}%` : undefined,
    alt: img.alt ?? '',
  };
}

/** Use the CMS value when the editor filled it in, otherwise the approved local copy. */
export function pick<T>(cms: T | null | undefined, local: T): T {
  if (cms === null || cms === undefined) return local;
  if (typeof cms === 'string' && cms.trim() === '') return local;
  if (Array.isArray(cms) && cms.length === 0) return local;
  return cms;
}
