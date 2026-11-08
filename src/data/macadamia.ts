/**
 * Macadamia page extras. Every line of copy comes from the approved macadamia text on mahela.co.za
 * (produce page): Beaumont macadamias for the export market, harvested May through to July,
 * marketed through Tzamac, dry nuts in shell (NIS) mainly to China, kernel to the USA and the EU.
 */
type Card = {
  short: string;
  title: string;
  stat: string;
  statLabel: string;
  text: string;
  /** Rail icon: a cut-out image path, or a line icon name. */
  icon: { img?: string; line?: 'leaf' | 'shield' | 'box' | 'sun' | 'globe' };
  /** Section background tones for this card. */
  tone: [string, string];
};

export const macadamiaCards: Card[] = [
  {
    short: 'Beaumont',
    title: 'Beaumont macadamias',
    stat: 'Export',
    statLabel: 'grown for the export market',
    text: 'Mahela Group produces Beaumont Macadamias for the export market.',
    icon: { img: 'produce/renders/macadamia.webp' },
    tone: ['#6f8a2c', '#17220a'],
  },
  {
    short: 'Harvest',
    title: 'Harvested May to July',
    stat: '3',
    statLabel: 'months of harvest, May to July',
    text: 'The nuts are harvested in May through to July.',
    icon: { line: 'sun' },
    tone: ['#8a5a33', '#24140a'],
  },
  {
    short: 'Tzamac',
    title: 'Marketed through Tzamac',
    stat: '2',
    statLabel: 'forms: nuts in shell and kernel',
    text: 'Our nuts are marketed through Tzamac. Dry nuts in shell (NIS) are exported mainly to China, while kernel is channelled to the USA and the EU markets.',
    icon: { line: 'globe' },
    tone: ['#b88d4e', '#2e200c'],
  },
];

/** The three steps of the "one harvest, two markets" scroll scene. */
export const macadamiaRoute = [
  { icon: 'sun', title: 'Harvested May to July', text: 'Mahela’s Beaumont macadamias are harvested in May through to July and marketed through Tzamac.' },
  { icon: 'globe', title: 'Nuts in shell to China', text: 'Dry nuts in shell (NIS) are exported mainly to China.' },
  { icon: 'box', title: 'Kernel to the USA and EU', text: 'Kernel is channelled to the USA and the EU markets.' },
] as const;
