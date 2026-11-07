/** Citrus page extras: the five variety groups with their art and colours. Variety copy comes from the approved citrus page. */
import { produceDetail } from './pages';

/**
 * Picking windows (month positions, 0 = January; 3.1 = early April) from Pieter Vorster's
 * description in the 2023 Farmer's Weekly article on the Mahela news page. Still to be confirmed
 * by the client. `open` = the article gives a start but no end, so the bar fades out.
 */
type Pick = { from: number; to: number; open?: boolean; label: string };
const art: Record<string, { art: string; tone: [string, string]; short: string; pick: Pick }> = {
  Grapefruit: { art: 'produce/cutouts/grapefruit-sticker.webp', tone: ['#e0506c', '#5a1426'], short: 'Grapefruit', pick: { from: 3.1, to: 5.5, label: 'Picked early April to mid-June' } },
  'Valencia oranges': { art: 'produce/renders/orange.webp', tone: ['#f08a1c', '#6e3208'], short: 'Valencias', pick: { from: 7.7, to: 9, label: 'Picked late August to end of September' } },
  Navels: { art: 'produce/cutouts/orange-with-leaves-b.webp', tone: ['#e2602a', '#64200b'], short: 'Navels', pick: { from: 4.75, to: 6.6, open: true, label: 'Picking starts in the last week of May' } },
  'Soft citrus': { art: 'produce/renders/mandarin.webp', tone: ['#f4a024', '#6f400a'], short: 'Soft citrus', pick: { from: 6.75, to: 7.8, label: 'Picked end of July to late August' } },
  Lemons: { art: 'produce/renders/lemon.webp', tone: ['#d9bd1c', '#5a4a06'], short: 'Lemons', pick: { from: 2, to: 4, open: true, label: 'First of the season: picking starts in March' } },
};

export const citrusGroups = (produceDetail.citrus!.groups ?? []).map((g) => ({ ...g, ...art[g.group]! }));

/**
 * Packing season from the approved copy: end of March to end of September.
 * Values are month positions (0 = January); 2.75 means the last week of March.
 */
export const citrusSeason = { start: 2.75, end: 9, label: 'Packing season: end of March to end of September' };
export const citrusTotal = citrusGroups.reduce((n, g) => n + g.varieties.length, 0);
