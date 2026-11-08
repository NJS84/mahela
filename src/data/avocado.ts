/**
 * Avocado page extras. Variety copy comes from the approved avocado page; the weight ranges and
 * ripe skin colour are taken straight from that copy. Harvest: March to July (approved copy), with
 * new orchards at different altitudes expected to stretch availability to December.
 */
import { produceDetail } from './pages';

type Extra = { short: string; grams: [number, number]; skin: 'green' | 'dark'; skinLabel: string; tone: [string, string] };
const extra: Record<string, Extra> = {
  Fuerte: { short: 'Fuerte', grams: [170, 340], skin: 'green', skinLabel: 'Stays green when ripe', tone: ['#7fa33c', '#1f3309'] },
  Hass: { short: 'Hass', grams: [142, 350], skin: 'dark', skinLabel: 'Ripens to deep purple or nearly black', tone: ['#6b3d5c', '#1a0c18'] },
  Carmen: { short: 'Carmen', grams: [170, 400], skin: 'dark', skinLabel: 'Looks like Hass when spring-set', tone: ['#55703a', '#121c0b'] },
  Maluma: { short: 'Maluma', grams: [150, 400], skin: 'dark', skinLabel: 'Ripens to dark purple-black', tone: ['#5a3352', '#160a14'] },
  Ryan: { short: 'Ryan', grams: [300, 400], skin: 'green', skinLabel: 'Stays green when ripe', tone: ['#6c9a35', '#1b300a'] },
};

const art = {
  green: { big: 'produce/cutouts/avocado-halved.webp', icon: 'produce/cutouts/avocado-half-seed.webp' },
  dark: { big: 'produce/cutouts/avocado-pair-sticker.webp', icon: 'produce/cutouts/avocado-hass-whole.webp' },
};

export const avocadoVarieties = (produceDetail.avocados!.groups?.[0]?.varieties ?? []).map((v) => {
  const e = extra[v.name]!;
  return { ...v, ...e, art: art[e.skin] };
});

/** Weight scale shown under every variety (grams). */
export const avocadoScale = { min: 100, max: 450 };
/** Harvest (month positions, 0 = January): March to the end of July; new orchards aim to reach December. */
export const avocadoHarvest = { from: 2, to: 7, label: 'Harvest: March to July' };
export const avocadoFuture = { from: 7, to: 12, label: 'New orchards at other altitudes: towards December' };
