/**
 * Site content for the home page draft.
 * Copy is taken from the 2026 EU-exporter draft and the 2019 live pages.
 * Items marked `confirm` still need a fact check with Mahela.
 */

export const site = {
  name: 'Mahela Group',
  url: 'https://www.mahela.co.za',
  description:
    'Mahela Group is a 4th generation agricultural company in the Lowveld of Limpopo, South Africa, and one of the country’s biggest privately-owned citrus producers and exporters.',
  phone: '+27 15 345 1600',
  phoneHref: 'tel:+27153451600',
  fax: '+27 15 345 1601',
  email: 'info@mahela.co.za',
  address: {
    street: 'Main Road, R71, The Junction',
    locality: 'Letsitele',
    region: 'Limpopo',
    postalCode: '0885',
    country: 'ZA',
    postal: 'P.O. Box 114, Letsitele, 0885',
  },
  hours: 'Monday – Friday (except public holidays): 08:00 – 17:00',
  social: {
    facebook: 'https://www.facebook.com/MahelaGroupSA/',
    x: 'https://x.com/Mahela_Group',
  },
};

export const nav = [
  { label: 'About', href: '/about-us' },
  { label: 'Produce', href: '/produce' },
  { label: 'Packhouses', href: '/packhouses' },
  { label: 'Export', href: '/export' },
  { label: 'Mahela Cares', href: '/mahela-cares' },
  { label: 'Mahela Game', href: '/mahela-game' },
  { label: 'News', href: '/news' },
];

export const hero = {
  eyebrow: 'EU-compliant citrus exporters • South Africa',
  title: 'Premium citrus. Ready for the world.',
  lead: 'Based in the heart of Limpopo’s premier agricultural region, Mahela Group is one of South Africa’s leading large-scale producers and exporters of premium citrus, subtropical fruits and certified nursery trees.',
  primary: { label: 'Start an export conversation', href: '/contact-us' },
  secondary: { label: 'Explore our produce', href: '/produce' },
};

export const intro = {
  eyebrow: 'Welcome to Mahela Group',
  text: 'Mahela Group is a 4th generation agricultural company based in the fertile Lowveld region of South Africa. We are one of the country’s biggest privately-owned citrus producers and exporters.',
  support:
    'Our fruit is produced in an ethical and environmentally sustainable manner and in accordance with GlobalGAP requirements. We take pride in the quality of our produce and the contribution we make, through our various operations and partnerships, towards food security, job creation and conservation.',
};

export const metrics = [
  { value: 1942, label: 'Year the first land was farmed at The Junction', format: 'year' },
  { value: 700, label: 'Full-time employees', confirm: true },
  { value: 1100, label: 'Additional non-permanent jobs', confirm: true },
  { value: 20000, suffix: ' m²', label: 'Combined packhouse area' },
  { value: 1200, prefix: 'Up to ', suffix: ' t', label: 'Fruit handled daily in season' },
  { value: 2003, label: 'Fully GlobalGAP certified since', format: 'year' },
];

export type Produce = {
  slug: string;
  name: string;
  tag: string;
  summary: string;
  facts: string[];
  tone: [string, string];
};

export const produce: Produce[] = [
  {
    slug: 'citrus',
    name: 'Citrus',
    tag: 'Core export category',
    summary:
      'Grapefruit, oranges, navels, soft citrus and lemons. The warm days and cold nights of our region produce citrus with well-balanced sugar and acidity, and good fibre and moisture content.',
    facts: ['Star Ruby, Shaddock / Pomelo', 'Valencia, Turkey, Midknight, Delta', 'Cara Cara navels', 'Nules Clementine, Samba, Gold Nugget, Tango', 'Genoa, Eureka lemons'],
    tone: ['#e8742a', '#7a2e0b'],
  },
  {
    slug: 'avocados',
    name: 'Avocados',
    tag: 'Harvest March – July',
    summary:
      'Produced according to GlobalGAP and Tesco standards, with bio-fertilisers and improved water management by means of continuous loggers.',
    facts: ['Fuerte, Hass, Carmen, Maluma, Ryan', 'Marketed by Westfalia', 'SIZA accredited'],
    tone: ['#5f7f2a', '#1d2e0d'],
  },
  {
    slug: 'bananas',
    name: 'Bananas',
    tag: 'Mala-Mala brand',
    summary:
      'Cavendish-type bananas fertilised with a bio-fertiliser and packed on-farm, ensuring minimum bruising, then transported directly to ripening facilities at all major South African markets.',
    facts: ['Two-thirds harvested in summer', 'Distributed in SA, Botswana and Namibia'],
    tone: ['#d9b13b', '#5b4510'],
  },
  {
    slug: 'macadamias',
    name: 'Macadamias',
    tag: 'Harvest May – July',
    summary:
      'Beaumont macadamias for the export market, marketed through Tzamac. Nuts in shell go mainly to China, while kernel is channelled to the USA and the EU.',
    facts: ['Beaumont variety', 'Marketed through Tzamac'],
    tone: ['#9a6b43', '#3a2414'],
  },
  {
    slug: 'litchis',
    name: 'Litchis',
    tag: 'Harvest December – January',
    summary:
      'Mauritius litchis from orchards first planted by the late BJ Vorster in 1947, exported to the EU and the Middle East through Westfalia Marketing.',
    facts: ['First orchards planted 1947', 'Exported to EU and Middle East'],
    tone: ['#b8344f', '#4a0e1c'],
  },
  {
    slug: 'kiwis',
    name: 'Golden kiwis',
    tag: 'Harvest February',
    summary:
      'One of only a handful of golden kiwi producers in South Africa. Sorelli kiwis grown in Magoebaskloof, where the high altitude and cold climate deter virtually all pests and fungi.',
    facts: ['Sorelli variety', 'Sold in the EU, the East and locally'],
    tone: ['#b5b23a', '#3d3c0f'],
  },
];

export const process = {
  eyebrow: 'From orchard to market',
  title: 'A controlled journey from rootstock to retail shelf.',
  lead: 'Mahela combines tried-and-tested orchard management with certified nursery trees, modern grading technology, rigorous testing and disciplined cold-chain management. The result is consistent, ethically grown produce prepared for demanding international markets.',
  steps: [
    { title: 'Certified nursery', text: 'High-quality, disease-free trees establish the foundation for long-term orchard performance.' },
    { title: 'Expert orchards', text: 'Experienced teams use proven practices to manage quality, flavour and consistency.' },
    { title: 'Optical grading', text: 'Modern sorting technology grades fruit accurately and supports multi-client packing.' },
    { title: 'Cold-chain control', text: 'Strict temperature and handling protocols protect freshness through the supply chain.' },
    { title: 'Global delivery', text: 'Export-ready fruit moves from Limpopo packhouses to ports and international markets.' },
  ],
};

export const compliance = {
  eyebrow: 'Quality & compliance',
  title: 'Confidence for importers. Discipline at source.',
  lead: 'Fully GlobalGAP and SIZA compliant, Mahela combines ethical production standards with state-of-the-art optical grading, on-site quality testing and strict cold-chain management.',
  pillars: [
    { title: 'GlobalGAP compliance', text: 'Certified since 2003. Production practices and traceable systems support quality and food-safety requirements.' },
    { title: 'SIZA accreditation', text: 'Ethical labour and environmental practices form part of the way Mahela operates.' },
    { title: 'On-site quality control', text: 'Fruit undergoes multiple tests, with PPECB inspectors present full-time during packing season.' },
    { title: 'High-volume capability', text: 'Two packhouses support simultaneous packing and up to 1 200 tons of fruit daily during double shifts.' },
  ],
  memberships: ['GlobalGAP', 'SIZA', 'NSF Registered', 'PMA', 'FPEF', 'Tesco'],
};

export const markets = {
  eyebrow: 'Global market access',
  title: 'From Limpopo to international markets.',
  lead: 'Mahela fruit is exported to Europe, Asia, Japan, the Middle East, the Far East and Russia under the Makulu Citrus, Mahela Boerdery and Mala-Mala Citrus brands.',
  regions: [
    { name: 'Europe', text: 'Compliance-led production, inspection and cold-chain discipline for demanding EU programmes.', primary: true },
    { name: 'Asia', text: 'Established international export reach.' },
    { name: 'Japan', text: 'Premium-market quality focus.' },
    { name: 'Middle East', text: 'Diverse produce and seasonal programmes.' },
    { name: 'Far East + Russia', text: 'Broader global distribution network.' },
  ],
};

export const heritage = {
  eyebrow: 'Our history',
  title: 'Four generations on the same Lowveld soil.',
  milestones: [
    { year: '1942', text: 'Barend (Ben) Jacobus Vorster rents his first land, a section of The Junction farm outside Letsitele.' },
    { year: '1947', text: 'The first litchi orchards are planted on land the Group still owns today.' },
    { year: '1950', text: 'Ben plants his first citrus tree, the start of one of South Africa’s biggest privately-owned citrus exporters.' },
    { year: '1960s', text: 'Sons Edward and Pieter join the business and expand the family’s farming operations.' },
    { year: '1988', text: 'The family business splits: BJ Vorster Boerdery becomes Mahela Boerdery (Edward) and Laeveld Sitrus (Pieter).' },
    { year: 'Today', text: 'Edward and his four sons, Barend, Pieter, Eddie and Francois, lead Mahela Group, now joined by the fourth generation.' },
  ],
};

export const people = {
  eyebrow: 'Ethically grown',
  title: 'Technology matters. People make it work.',
  text: 'Mahela’s experienced farmers, technicians and packhouse teams bring care and precision to every stage of production. SIZA-aligned ethical labour practices, training and community investment reinforce the reliability behind the fruit.',
  cta: { label: 'Discover Mahela Cares', href: '/mahela-cares' },
};

export const news = [
  { title: 'Partners pull together to finalise Skutwater farming operations', href: '/news', source: 'Tzaneen Voice' },
  { title: 'The newly renovated Hlokomela Junction clinic officially opened in Letsitele', href: '/news', source: 'Tzaneen Voice' },
  { title: 'How an SA producer grows 70 000 t of citrus a year', href: '/news', source: 'Farmer’s Weekly' },
];

export const cta = {
  eyebrow: 'Importers • Retailers • Programme buyers',
  title: 'Build your next citrus programme with Mahela.',
  text: 'Discuss varieties, specifications, market windows, packhouse capability and export requirements with the Mahela team.',
  primary: { label: 'Contact the export team', href: '/contact-us' },
};
