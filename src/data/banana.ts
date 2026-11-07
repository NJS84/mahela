/**
 * Banana page extras. Every line of copy comes from the approved bananas text on mahela.co.za
 * (produce page): Cavendish, two-thirds harvested in summer and the rest in winter, no chemicals and
 * a bio-fertiliser, packed on-farm, ripening facilities at all major South African markets, some to
 * Botswana and Namibia, and the Mala-Mala brand founded in the 1960s by the late BJ Vorster.
 */
type Card = {
  short: string;
  title: string;
  stat: string;
  statLabel: string;
  text: string;
  /** Rail icon: a cut-out image path, or a line icon name. */
  icon: { img?: string; line?: 'leaf' | 'shield' | 'box' | 'sun' };
  /** Section background tones for this card. */
  tone: [string, string];
};

export const bananaCards: Card[] = [
  {
    short: 'Cavendish',
    title: 'Cavendish bananas',
    stat: '⅔',
    statLabel: 'of the crop harvested in summer',
    text: 'Mahela Group produce Cavendish type bananas. Two-thirds of the bananas are harvested in summer and the rest in winter.',
    icon: { img: 'produce/renders/banana.webp' },
    tone: ['#b58a12', '#3a2804'],
  },
  {
    short: 'Natural',
    title: 'Grown without chemicals',
    stat: '0',
    statLabel: 'chemicals used in production',
    text: 'No chemicals are used in the production of the bananas. Fertilising is done with a bio-fertiliser.',
    icon: { line: 'leaf' },
    tone: ['#5f8a2a', '#16260a'],
  },
  {
    short: 'Mala-Mala',
    title: 'The Mala-Mala brand',
    stat: '1960s',
    statLabel: 'founded by the late BJ Vorster',
    text: 'Bananas are marketed under the well-known Mala-Mala brand. This brand was founded in the 1960s by the late BJ Vorster.',
    icon: { line: 'shield' },
    tone: ['#2f5a8f', '#0d1a2c'],
  },
];

/** The farm-to-market journey shown in the ripening scroll scene. */
export const bananaRoute = [
  { icon: 'box', title: 'Packed on the farm', text: 'Bananas are packed on-farm, thereby ensuring minimum bruising due to handling.' },
  { icon: 'truck', title: 'Straight to ripening', text: 'The packed bananas are transported directly from farm to ripening facilities at all major markets in South Africa.' },
  { icon: 'globe', title: 'South Africa, Botswana and Namibia', text: 'Mala-Mala bananas reach all major South African markets. Some are distributed to Botswana and Namibia.' },
] as const;
