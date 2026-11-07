/**
 * Litchi page extras. Every line of copy comes from the approved litchi text on mahela.co.za
 * (produce page): first orchards planted by the late BJ Vorster in 1947, a few left unpruned to grow
 * into giants in his memory; Mauritius litchis harvested December and early January; exported to
 * the EU and Middle East, marketed through Westfalia Marketing; fruit below export standard is juiced.
 */
type Card = {
  short: string;
  title: string;
  stat: string;
  statLabel: string;
  text: string;
  icon: { img?: string; line?: 'leaf' | 'shield' | 'box' | 'sun' | 'globe' | 'drop' };
  /** Left-hand fruit for this card. */
  art: string;
  /** Section background tones for this card. */
  tone: [string, string];
};

export const litchiCards: Card[] = [
  {
    short: '1947',
    title: 'First planted in 1947',
    stat: '1947',
    statLabel: 'first litchi orchards, planted by BJ Vorster',
    text: 'The late BJ Vorster planted the first litchi orchards in 1947 on land that today is owned by the Mahela Group. A few of these trees, left unpruned, have been allowed to grow into giants, in memory of BJ Vorster.',
    icon: { line: 'leaf' },
    art: 'produce/renders/litchi.webp',
    tone: ['#7a1f33', '#22070f'],
  },
  {
    short: 'Mauritius',
    title: 'Mauritius litchis',
    stat: 'Mauritius',
    statLabel: 'the variety grown on our farms',
    text: 'The litchis produced on our farms are Mauritius litchis.',
    icon: { img: 'produce/cutouts/litchi-whole-a.webp' },
    art: 'produce/cutouts/litchi-whole-a.webp',
    tone: ['#b8344f', '#2c0912'],
  },
  {
    short: 'Harvest',
    title: 'Harvested December to early January',
    stat: 'Dec',
    statLabel: 'into early January, at the height of summer',
    text: 'Our litchis are harvested in December and early January.',
    icon: { line: 'sun' },
    art: 'produce/cutouts/litchi-open-right.webp',
    tone: ['#c9485f', '#330b16'],
  },
  {
    short: 'Markets',
    title: 'Exported to the EU and Middle East',
    stat: '2',
    statLabel: 'export markets, through Westfalia Marketing',
    text: 'They are exported to the EU and Middle East. The marketing is done through Westfalia Marketing.',
    icon: { line: 'globe' },
    art: 'produce/cutouts/litchi-open-petals.webp',
    tone: ['#a5405e', '#280a19'],
  },
  {
    short: 'No waste',
    title: 'Nothing goes to waste',
    stat: '0',
    statLabel: 'fruit wasted: the rest is juiced',
    text: 'We don’t let any of our fruit go to waste. Any fruit that doesn’t meet export standards is juiced.',
    icon: { line: 'drop' },
    art: 'produce/cutouts/litchi-peeled.webp',
    tone: ['#c07a8a', '#2e1018'],
  },
];

/** The three steps of the "ruby shell, pearl inside" scroll scene. */
export const litchiSteps = [
  { icon: 'sun', title: 'Picked December to early January', text: 'Mahela’s Mauritius litchis are harvested in December and early January.' },
  { icon: 'globe', title: 'Exported to the EU and Middle East', text: 'They are exported to the EU and Middle East. The marketing is done through Westfalia Marketing.' },
  { icon: 'drop', title: 'Nothing goes to waste', text: 'Any fruit that doesn’t meet export standards is juiced.' },
] as const;
