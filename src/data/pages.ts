/**
 * Interior-page content. Copy is lifted from the 2019 live pages and the 2026
 * EU-exporter draft with only structural edits (headings, short leads, fact
 * lists pulled from existing sentences). Items marked `confirm` still need a
 * fact check with Mahela.
 */

export const about = {
  title: 'About Mahela Group',
  lead: 'Mahela Group employs 700 full-time employees and provides an additional 1 100 non-permanent jobs.',
  history: [
    'The late Barend (Ben) Jacobus Vorster laid the foundation of what was to become Mahela Group in 1942 when he rented his first piece of land, a section of The Junction farm, outside Letsitele in the Mopani district of Limpopo, South Africa.',
    'He initially farmed with vegetables, but in 1950 he planted his first citrus tree, paving the way for what was to become one of South Africa’s biggest privately-owned citrus exporters.',
    'Ben’s sons, Edward and Pieter, joined him in the 1960s and together they farmed and expanded the family’s farming operations. Upon Ben’s passing, Edward and Pieter continued to build on his legacy. In 1988 they decided to split the family business between themselves. BJ Vorster Boerdery became Mahela Boerdery (Edward) and Laeveld Sitrus (Pieter).',
    'Today Edward and his four sons, Barend, Pieter, Eddie and Francois, oversee a diverse grouping of farming interests under the umbrella of Mahela Group. Recently the younger and fourth generation joined the family in the business.',
  ],
  today: [
    'The various business interests of Mahela Boerdery are grouped together under the Mahela Group. These include the production of various fruit and nuts, a nursery, fruit packing and exporting, the rearing of livestock, game breeding and chartered flights.',
    'Mahela also holds shares in a juice company (Granor Passi), a carton manufacturer (Houers) and a chemical company (Destrimix).',
    'The biggest percentage of fruit produced on Mahela farms is citrus. These are exported to Europe, Asia, Japan, the Middle East, the Far East and Russia under the brands of Makulu Citrus, Mahela Boerdery and Mala-Mala Citrus.',
  ],
  divisions: [
    { title: 'Fruit and nuts', text: 'Citrus, avocados, bananas, macadamias, litchis and golden kiwis.', href: '/produce', icon: 'leaf' },
    { title: 'Nursery', text: 'Certified, disease-free trees ensure quality and food safety.', href: '/produce#nursery', icon: 'sprout' },
    { title: 'Packing and export', text: 'Two state-of-the-art packhouses with optical grading and on-site testing.', href: '/packhouses', icon: 'box' },
    { title: 'Game breeding', text: 'Breeding rarer game species to conserve and improve their genetics.', href: '/mahela-game', icon: 'globe' },
    { title: 'Livestock', text: 'The rearing of livestock as part of a diversified farming group.', href: '/about-us#today', icon: 'sun' },
    { title: 'Shareholdings', text: 'Granor Passi (juice), Houers (cartons) and Destrimix (chemicals).', href: '/about-us#today', icon: 'shield' },
  ],
  values: [
    { title: 'Quality fruit', text: 'From production to delivery, we aim to produce fruit that are of the highest quality.', icon: 'leaf' },
    { title: 'Custodians of nature', text: 'We see ourselves as custodians of nature. We, therefore, strive towards producing fruit in an environmentally sustainable and responsible manner.', icon: 'drop' },
    { title: 'Caring for our people', text: 'Our employees are important to us. Apart from adhering to South Africa’s labour laws, we go the extra mile to ensure that our employees have opportunities to improve their lives and those of their families.', icon: 'heart' },
    { title: 'Uplifting our community', text: 'We realise that Mahela Group is part of a greater community. We acknowledge that Mahela Group has a responsibility to contribute to the socio-economic wellbeing of our community.', icon: 'people' },
  ],
};

export const leadership = {
  title: 'Board of directors',
  lead: 'Mahela Group’s policy and strategy are shaped by five executive directors and two non-executive directors. Louis von Zeuner is chairman of the board, and Barend, Pieter, Eddie and Francois each oversee a different aspect of the company.',
  confirm: true,
  directors: [
    { name: 'Edward Vorster', role: 'Executive director', image: 'edward' },
    { name: 'Barend Vorster', role: 'Executive director', image: 'barend' },
    { name: 'Pieter Vorster', role: 'Executive director', image: 'pieter' },
    { name: 'Eddie Vorster', role: 'Executive director, production', image: 'eddie' },
    { name: 'Francois Vorster', role: 'Executive director', image: 'fracois2' },
  ],
  chair: { name: 'Louis von Zeuner', role: 'Chairman of the board (non-executive)' },
};

export type Variety = { name: string; text: string };
export type VarietyGroup = { group: string; varieties: Variety[] };

export const produceDetail: Record<
  string,
  {
    title: string;
    metaTitle: string;
    description: string;
    answer: string;
    facts: { label: string; value: string }[];
    body: string[];
    groups?: VarietyGroup[];
    hero: string;
    gallery: string[];
    accent: string;
  }
> = {
  citrus: {
    title: 'Citrus',
    metaTitle: 'South African citrus exporter: grapefruit, oranges, soft citrus, lemons',
    description:
      'Mahela Group grows and exports grapefruit, Valencia oranges, Cara Cara navels, soft citrus and lemons from Letsitele and Ohrigstad in Limpopo, South Africa.',
    answer:
      'Mahela Group’s citrus brands are renowned for delivering top quality fruit that exceed consumer expectations year after year. The warm days and cold nights of our region are beneficial for producing citrus with well-balanced levels of sugar and acidity as well as good fibre and moisture content.',
    facts: [
      { label: 'Groups', value: 'Grapefruit, Valencia oranges, navels, soft citrus, lemons' },
      { label: 'Packing season', value: 'End of March to end of September' },
      { label: 'Packhouses', value: 'The Junction (Letsitele) and Ohrigstad' },
      { label: 'Brands', value: 'Makulu Citrus, Mahela Boerdery, Mala-Mala Citrus' },
      { label: 'Markets', value: 'Europe, Asia, Japan, the Middle East, the Far East, Russia' },
      { label: 'Certification', value: 'GlobalGAP (since 2003), SIZA' },
    ],
    body: [
      'Tried and tested orchard management practices, implemented by our experienced farmers, ensure that our orchards stay healthy and bear quality fruit. These include the extensive use of beneficial insects in pest control management and using only the highest quality inputs.',
    ],
    groups: [
      {
        group: 'Grapefruit',
        varieties: [
          { name: 'Star Ruby', text: 'Fruit are globular and slightly flattened, growing to a size of 15 cm in diameter and 12 cm in height. Smooth yellow skin with a pink blush and deep red flesh with few, if any, seeds. The pulp is juicy with a sweet-tart flavour.' },
          { name: 'Shaddock (pomelo)', text: 'Also called Chinese grapefruit, pumelo, pommelo and pompelmous. Fruit range from nearly round to oblate or pear-shaped and are 10 to 30 cm wide. A white, thicker spongy pith encloses the flesh, which is made up of 9 to 14 sections. The flesh is white, mild yellow, pink or even rose-red, juicy, with a fairly sweet, bitter or even spicy-sweet flavour.' },
        ],
      },
      {
        group: 'Valencia oranges',
        varieties: [
          { name: 'Valencia', text: 'A large orange with a smooth and sometimes finely pebbled surface and a moderately thin rind that clings loosely to its segmented flesh. The light orange flesh contains very few seeds and is sweet, juicy and tender. Primarily for juicing, but also eaten fresh.' },
          { name: 'Turkey', text: 'Round to slightly elongated with a distinctive ring around the end of the fruit. Fruit size varies from 79 to 85 mm. The rind is a deep orange colour and easy to peel; the flesh is very soft compared to most Valencias.' },
          { name: 'Midknight', text: 'Somewhat oblong with a significantly larger fruit size than most Valencias, and a moderately thin, very smooth rind. Soft, succulent, virtually seedless flesh with more sugar and fewer acids than standard Valencias. A very good all-round orange for sweetness, flavour and juice content.' },
          { name: 'Delta', text: 'Similar to other Valencias but slightly more erect in shape and slightly larger, with a well-coloured, very smooth rind. Light orange, virtually seedless flesh with lower sugar and acidity than standard Valencia. Ideal for juicing.' },
        ],
      },
      {
        group: 'Navels',
        varieties: [{ name: 'Cara Cara', text: 'A medium-sized navel with a glossy, textured rind. The inner flesh is reddish-pink, resembling ruby grapefruit. Seedless, tender, succulent and extremely juicy, with high sugar content and comparatively low acid levels.' }],
      },
      {
        group: 'Soft citrus',
        varieties: [
          { name: 'Nules Clementine', text: 'This easy-peeler has a smooth rind with rich orange flesh that is sweet, soft and juicy.' },
          { name: 'Samba', text: 'Another easy-peeler with exceptional flavour and colour and a low seed count. Size range is from 50 to 64 mm.' },
          { name: 'Gold Nugget', text: 'Usually medium in size and roughly rounded with a somewhat bumpy rind, moderately easy to peel. The flesh is bright orange, finely textured and seedless, with a rich, sweet flavour.' },
          { name: 'Tango', text: 'An absolutely seedless, medium-sized, oblong fruit with a very smooth, easy-to-peel rind. Fine-textured flesh with high juice content, good acidity balance and high sugar levels.' },
        ],
      },
      {
        group: 'Lemons',
        varieties: [
          { name: 'Genoa', text: 'Rounder than other lemons with a small shoulder, and a smooth to occasionally coarse, but thin, rind.' },
          { name: 'Eureka', text: 'Large, averaging 5 cm in diameter, with an oblong shape and vibrant yellow skin with sunken oil glands. The rind is full of volatile oils, providing an intense citrus aroma.' },
        ],
      },
    ],
    hero: 'produce/photos/ripe-oranges-on-tree-in-orange-garden.jpg',
    gallery: ['produce/photos/tango27.jpg', 'produce/photos/star-ruby-2-0-15.jpg', 'produce/photos/mahela-shadock-cc21.jpg', 'produce/photos/mahela-lemon30.jpg'],
    accent: '#e8742a',
  },
  avocados: {
    title: 'Avocados',
    metaTitle: 'Avocados from Limpopo: Fuerte, Hass, Carmen, Maluma and Ryan',
    description: 'Mahela Group produces Fuerte, Hass, Carmen, Maluma and Ryan avocados in Limpopo to GlobalGAP and Tesco standards, harvested March to July and marketed by Westfalia.',
    answer:
      'Mahela Group’s avocados are produced according to GlobalGAP and Tesco standards. We continually evaluate and improve our production methods to lower our environmental impact. This includes the use of bio-fertilisers and improved water management by means of continuous loggers. We are also SIZA accredited.',
    facts: [
      { label: 'Harvest', value: 'March to July' },
      { label: 'Varieties', value: 'Fuerte, Hass, Carmen, Maluma, Ryan' },
      { label: 'Marketing', value: 'Westfalia Marketing' },
      { label: 'Markets', value: 'Mostly export, some South African supermarkets' },
      { label: 'Standards', value: 'GlobalGAP, Tesco, SIZA' },
    ],
    body: [
      'Harvest time starts in March and ends in July. New orchards are being developed at different altitudes; the resulting variation will expand the availability of Mahela’s avocados to December.',
      'The avocados are marketed and distributed by Westfalia Marketing. Most of the avocados are exported, with some sold to supermarkets in South Africa. Fruit not suitable for export or the supermarket is used for producing guacamole or avocado oil.',
    ],
    groups: [
      {
        group: 'Varieties',
        varieties: [
          { name: 'Fuerte', text: 'Pear-shaped, 170 to 340 g, with smooth, medium-thin skin that peels easily and remains green as the fruit ripens. Dense, pale green flesh, marginally oily, with a rich, creamy flavour and notes of hazelnut.' },
          { name: 'Hass', text: 'Egg-shaped, 142 to 350 g, with thick pebbly skin that ripens from green to deep purple or nearly black. Soft, creamy, barely fibrous flesh with good oil content and a rich, nutty flavour with a slightly sweet finish.' },
          { name: 'Carmen', text: 'Spring-set fruit looks identical to Hass; autumn-set fruit is larger, rounder and smoother. 170 to 400 g, with creamy flesh and an excellent flavour.' },
          { name: 'Maluma', text: 'Pear-shaped, 150 to 400 g. The skin ripens to a dark purple-black, and the flesh is smooth with a nutty flavour. Seeds are small.' },
          { name: 'Ryan', text: 'Egg-shaped, 300 to 400 g, with thick, pebbled skin that remains green on ripening. Good flavour; the seed is large.' },
        ],
      },
    ],
    hero: 'produce/photos/mahela-aug19.jpg',
    gallery: ['produce/photos/mahela-aug12.jpg', 'produce/styled/2026-whole-and-cut-avocados-with-green-leaves-on-white.jpg'],
    accent: '#6f8f2e',
  },
  bananas: {
    title: 'Bananas',
    metaTitle: 'Cavendish bananas from Limpopo under the Mala-Mala brand',
    description: 'Mahela Group grows Cavendish bananas in Limpopo, packed on-farm and sold under the Mala-Mala brand to ripening facilities across South Africa, Botswana and Namibia.',
    answer:
      'Mahela Group produce Cavendish type bananas. Two-thirds of the bananas are harvested in summer and the rest in winter. No chemicals are used in the production of the bananas. Fertilising is done with a bio-fertiliser.',
    facts: [
      { label: 'Type', value: 'Cavendish' },
      { label: 'Harvest', value: 'Two-thirds in summer, the rest in winter' },
      { label: 'Brand', value: 'Mala-Mala, founded in the 1960s by the late BJ Vorster' },
      { label: 'Markets', value: 'All major South African markets, Botswana, Namibia' },
    ],
    body: [
      'Bananas are packed on-farm, thereby ensuring minimum bruising due to handling. The packed bananas are transported directly from farm to ripening facilities at all major markets in South Africa. Some are distributed to Botswana and Namibia.',
      'Bananas are marketed under the well-known Mala-Mala brand. This brand was founded in the 1960s by the late BJ Vorster.',
    ],
    hero: 'produce/photos/mahela-aug18.jpg',
    gallery: ['produce/photos/mahela-aug33.jpg'],
    accent: '#d9b13b',
  },
  macadamias: {
    title: 'Macadamias',
    metaTitle: 'Beaumont macadamia nuts for export from South Africa',
    description: 'Mahela Group produces Beaumont macadamias for export, harvested May to July and marketed through Tzamac: nuts in shell mainly to China, kernel to the USA and EU.',
    answer:
      'Mahela Group produces Beaumont macadamias for the export market. The nuts are harvested in May through to July. Our nuts are marketed through Tzamac. Dry nuts in shell (NIS) are exported mainly to China, while kernel is channelled to the USA and the EU markets.',
    facts: [
      { label: 'Variety', value: 'Beaumont' },
      { label: 'Harvest', value: 'May to July' },
      { label: 'Marketing', value: 'Tzamac' },
      { label: 'Markets', value: 'Nuts in shell to China; kernel to the USA and EU' },
    ],
    body: [],
    hero: 'produce/photos/mahela-aug28.jpg',
    gallery: ['produce/photos/img-9307.jpg'],
    accent: '#9a6b43',
  },
  litchis: {
    title: 'Litchis',
    metaTitle: 'Mauritius litchis from South Africa, harvested December to January',
    description: 'Mahela Group grows Mauritius litchis in Limpopo from orchards first planted in 1947, harvested December to early January and exported to the EU and Middle East.',
    answer:
      'The late BJ Vorster planted the first litchi orchards in 1947 on land that today is owned by the Mahela Group. A few of these trees, left unpruned, have been allowed to grow into giants, in memory of BJ Vorster.',
    facts: [
      { label: 'Variety', value: 'Mauritius' },
      { label: 'Harvest', value: 'December to early January' },
      { label: 'Marketing', value: 'Westfalia Marketing' },
      { label: 'Markets', value: 'EU and the Middle East' },
      { label: 'First orchards', value: '1947' },
    ],
    body: [
      'The litchis produced on our farms are Mauritius litchis. Our litchis are harvested in December and early January. They are exported to the EU and Middle East. The marketing is done through Westfalia Marketing.',
      'We don’t let any of our fruit go to waste. Any fruit that doesn’t meet export standards is juiced.',
    ],
    hero: 'produce/photos/mahela-lichis-14.jpg',
    gallery: ['produce/photos/mahela-lichis-2.jpg', 'produce/photos/mahela-lichis-15.jpg'],
    accent: '#b8344f',
  },
  kiwis: {
    title: 'Golden kiwis',
    metaTitle: 'Sorelli golden kiwis grown in Magoebaskloof, South Africa',
    description: 'Mahela Group is one of only a handful of golden kiwi producers in South Africa, growing Sorelli kiwis in Magoebaskloof, harvested in February for the EU, the East and local markets.',
    answer:
      'We are one of only a handful of golden kiwi producers in South Africa. Our kiwis are of the Sorelli variety. Golden kiwis have smaller seeds and are sweeter tasting than green kiwis. They have a thin skin, and the hairs are shorter and fewer than those of green kiwis.',
    facts: [
      { label: 'Variety', value: 'Sorelli (golden)' },
      { label: 'Grown in', value: 'Magoebaskloof, Limpopo' },
      { label: 'Harvest', value: 'February' },
      { label: 'Markets', value: 'The EU, the East and the local market' },
    ],
    body: [
      'Our kiwi vines are situated in Magoebaskloof, a location that has an exceptional climate for kiwi production. The high altitude and cold climate deter virtually all pests and fungi.',
    ],
    hero: 'produce/photos/8.jpg',
    gallery: ['produce/photos/whatsapp-image-2019-04-11-at-09-54-111.jpg'],
    accent: '#b5b23a',
  },
};

export const packhouses = {
  title: 'Packhouses',
  lead: 'Two state-of-the-art packhouses ensure that we select, pack and ship only the best quality fruit from our orchards directly to our markets and clients across the globe.',
  sites: [
    { name: 'The Junction', place: 'Near Letsitele, Limpopo', packs: 'Lemons, pomelos and oranges' },
    { name: 'Ohrigstad', place: 'Ohrigstad, Limpopo', packs: 'Soft citrus, Cara Cara navels and lemons' },
  ],
  body: [
    'These two packhouses provide a combined packhouse area of 20 000 m². The citrus packing season kicks off at the end of March and lasts until the end of September. During the season, up to 1 200 tons of fruit can be handled daily during double shifts at both packhouses.',
    'All our fruit undergo multiple tests at Mahela’s on-site testing laboratories, and PPECB inspectors are on-site full-time during the packing season to ensure that the required standards are continuously met. Fruit that doesn’t adhere to Mahela’s strict export standards is sent to local markets or to a factory for juicing.',
    'Simultaneous packing for several clients can be done using the latest optical grading and sorting technology. From the packhouses, the pallets of fruit are transported per truck to local ports, where the fruit is once again inspected before it leaves for its export destination.',
  ],
  journey: [
    { title: 'Orchard', text: 'Fruit from certified nursery trees and expertly managed orchards arrives at the packhouse.', icon: 'leaf' },
    { title: 'Testing', text: 'Multiple tests at Mahela’s on-site laboratories, with PPECB inspectors on-site full-time in season.', icon: 'shield' },
    { title: 'Optical grading', text: 'The latest optical grading and sorting technology, with simultaneous packing for several clients.', icon: 'sun' },
    { title: 'Cold chain', text: 'Strict temperature and handling protocols protect freshness through the supply chain.', icon: 'drop' },
    { title: 'Port', text: 'Pallets travel by truck to local ports, where fruit is inspected again before it leaves.', icon: 'box' },
    { title: 'Market', text: 'Fruit ships to Europe, Asia, Japan, the Middle East, the Far East and Russia.', icon: 'globe' },
  ],
};

export const exportPage = {
  title: 'EU-compliant citrus exporters, South Africa',
  lead: 'Based in the heart of Limpopo’s premier agricultural region, Mahela Group is one of South Africa’s leading large-scale producers and exporters of premium citrus, subtropical fruits and certified nursery trees. Fully GlobalGAP and SIZA compliant, we combine state-of-the-art optical grading technology with strict cold-chain management to deliver high-volume, ethically grown produce directly to global importers and retail markets worldwide.',
  brands: ['Makulu Citrus', 'Mahela Boerdery', 'Mala-Mala Citrus'],
  markets: [
    { name: 'Europe', text: 'Compliance-led production, inspection and cold-chain discipline for demanding EU programmes.', primary: true, lat: 50, lon: 8 },
    { name: 'Russia', text: 'Broader global distribution network.', lat: 56, lon: 38 },
    { name: 'Middle East', text: 'Diverse produce and seasonal programmes.', lat: 25, lon: 51 },
    { name: 'Asia', text: 'Established international export reach.', lat: 22, lon: 114 },
    { name: 'Japan', text: 'Premium-market quality focus.', lat: 35.6, lon: 139.7 },
    { name: 'Far East', text: 'Broader global distribution network.', lat: 1.3, lon: 103.8 },
  ],
  origin: { name: 'Letsitele, Limpopo', lat: -23.88, lon: 30.39 },
  faq: [
    { q: 'Is Mahela Group GlobalGAP certified?', a: 'Yes. Mahela Group has been fully GlobalGAP certified since 2003 and is SIZA accredited.' },
    { q: 'Which citrus does Mahela export?', a: 'Grapefruit (Star Ruby, Shaddock / pomelo), Valencia oranges (Valencia, Turkey, Midknight, Delta), Cara Cara navels, soft citrus (Nules Clementine, Samba, Gold Nugget, Tango) and lemons (Genoa, Eureka).' },
    { q: 'When is the citrus packing season?', a: 'The citrus packing season kicks off at the end of March and lasts until the end of September.' },
    { q: 'How much fruit can Mahela pack?', a: 'Up to 1 200 tons of fruit can be handled daily during double shifts across the two packhouses, which have a combined area of 20 000 m².' },
    { q: 'Where does Mahela export to?', a: 'Europe, Asia, Japan, the Middle East, the Far East and Russia, under the Makulu Citrus, Mahela Boerdery and Mala-Mala Citrus brands.' },
  ],
};

export const cares = {
  title: 'Mahela Cares',
  lead: 'We take our role as employer, community member and custodian of the environment to heart.',
  employees: [
    'Mahela Group is accredited with SIZA, the Sustainability Initiative of South Africa, which certifies compliance with ethical labour and environmental practices. We believe that our responsibility as an employer goes beyond merely paying our employees a salary.',
    'By offering various ongoing training programmes such as computer, life skills training and adult literacy classes, employees are empowered to improve their standard of living. Working moms can focus on their careers, knowing that toddlers are well looked after by trained personnel in a Mahela Group crèche. With an on-farm primary school, their children need not walk long distances.',
    'Mahela Group promotes a healthy and well-balanced life by organising and sponsoring events such as soccer tournaments, fishing and cycling competitions. A vegetable project has also been rolled out where vegetable tunnels were erected on farms. Workers are supplied with everything they need to produce vegetables for themselves and their families.',
  ],
  khomanani:
    'The pride of our employee empowerment efforts is the Khomanani Mahela project. Mahela Group identified promising junior managers whom Mahela can upskill into commercial citrus farmers. Mahela provides the land and all the initial inputs for a start-up citrus farm and farms the orchards with the beneficiaries, who became co-owners of the land. Advanced farming know-how and skills such as financial planning, management and marketing are imparted on top of production skills, and they will share in future profits.',
  environment: [
    'As caretaker of the earth, we strive towards minimising our environmental footprint. Environmentally sustainable practices, as encompassed in the various standards Mahela Group is accredited to, are followed diligently.',
    'We have an integrated pest management system in place whereby the spraying of chemicals is kept to a minimum and natural predators are released to help control pests. Water management is optimised with the latest technology, such as an irrigation system using continuous drippers.',
    'A love for nature sees that large indigenous trees are left in place as far as possible when land is cleared for new orchards. We also regularly plant large numbers of indigenous trees on our farms. Mahela plays an active role in the conservation of wildlife. Game species such as the African wild dog and sable are some of the species we have helped to protect.',
  ],
  community: [
    'As one of the pioneering enterprises in the Lowveld, Mahela Group has and always will play a crucial role in the socio-economic well-being of the region. Apart from providing employment in a province where the unemployment and poverty rate is one of the highest in South Africa, the Group supports various non-profit entities and schools.',
    'One of these schools, the Junction primary school, is funded almost entirely by the Mahela Group, who also provided the land the school is built on. At the school, children are given the opportunity to get a good education, thanks to properly trained teachers, safe, functioning facilities and resources.',
  ],
  programmes: ['Computer and life skills training', 'Adult literacy classes', 'On-farm crèche', 'On-farm primary school', 'Vegetable tunnels for workers', 'Soccer, fishing and cycling events'],
};

export const game = {
  title: 'Mahela Game',
  lead: 'Mahela breeds some of the rarer game species with the aim of conserving and improving these game genetics.',
  body: [
    'Apart from the plentiful plains game that can be found on Mahela Group farms, Mahela breeds some of the rarer game species with the aim of conserving and improving these game genetics.',
    'Mahela Group owns and markets game under the name ‘Mahela Game’ as well as through a 50% partnership in BJ Vorster. BJ Vorster, in turn, markets its game as a member of Benchmark Game Breeders. Benchmark Game Breeders’ annual auction is a highlight on South Africa’s game auction calendar, with animals regularly selling for record prices.',
    'As part of the Gravelotte Study Group, Mahela co-founded a sable breeding project in 1998 to improve the genetic pool of the region’s sable. This saw the inclusion of the highly sought-after Western Zambian sable into our breeding programme. At the start of 2018, BJ Vorster owned three sable bulls with horns measuring more than 50 inches.',
  ],
  species: ['Roan', 'Sable', 'Kudu', 'Nyala', 'Reedbuck', 'Buffalo', 'Black impala', 'Bushbuck'],
};

export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  source?: string;
  url?: string;
  excerpt: string;
  lang?: 'en' | 'af';
  image?: string;
};

export const posts: NewsPost[] = [
  { slug: 'partners-pull-together-to-finalise-skutwater-farming-operations', title: 'Partners pull together to finalise Skutwater farming operations', date: '2024-10-02', source: 'Farmer’s Weekly', url: 'https://www.farmersweekly.co.za/agri-news/south-africa/partners-pull-together-to-finalise-skutwater-farming-operations/', excerpt: 'Farmer’s Weekly reports on the partners finalising the Skutwater farming operations.', image: 'press/partners-pull-together-to-finalise-skutwater-farming-operati.jpg' },
  { slug: 'hlokomela-junction-clinic-officially-opened-in-letsitele', title: 'The newly renovated Hlokomela Junction clinic officially opened in Letsitele', date: '2024-10-02', source: 'Tzaneen Voice', url: 'https://tzaneenvoice.co.za/the-newly-renovated-hlokomela-junction-clinic-officially-opened-in-letsitele/', excerpt: 'Tzaneen Voice covers the official opening of the newly renovated Hlokomela Junction clinic in Letsitele.', image: 'community/the-newly-renovated.jpg' },
  { slug: 'the-essentials-of-orchard-planning', title: 'The essentials of orchard planning', date: '2024-10-02', excerpt: 'A press article on the essentials of orchard planning, featuring Mahela.', image: 'press/orchardplanning1.jpg' },
  { slug: 'a-closer-look-at-biological-control', title: 'A closer look at biological control', date: '2024-10-02', excerpt: 'A press article on biological pest control, the use of beneficial insects that forms part of Mahela’s orchard management.', image: 'press/biologicalcongrolaug2024.jpg' },
  { slug: 'mahela-se-wortels-le-diep-in-die-vallei', title: 'Mahela se wortels lê diep in die vallei', date: '2024-10-02', lang: 'af', excerpt: 'An Afrikaans press feature on Mahela’s deep roots in the Letsitele valley.', image: 'press/mahela1.jpg' },
  { slug: 'how-an-sa-producer-grows-70-000t-of-citrus-a-year', title: 'How an SA producer grows 70 000 t of citrus a year', date: '2023-05-20', source: 'Farmer’s Weekly', url: 'https://www.farmersweekly.co.za/crops/fruit-and-nuts/how-an-sa-producer-grows-70-000t-of-citrus-a-year/', excerpt: 'The Mahela Group in the Letsitele Valley ascribes its success as a citrus producer to the sound investments it makes in the latest agricultural technologies and sustainable farming practices. In addition, the company has begun improving its cash flow and spreading risk by investing in subtropical crops, game and livestock farming.', image: 'farms/irrigation-dam.jpg' },
  { slug: 'plaaslike-landbouers-bele-groot-in-hoewaarde-kersies', title: 'Plaaslike landbouers belê groot in hoëwaarde-kersies', date: '2021-12-09', source: 'Letaba Herald', lang: 'af', excerpt: 'Letaba Herald (Afrikaans) on local farmers investing in high-value cherries.', image: 'press/plaaslike-landbouers-bele-groot-in-hoe-waarde-kersies-letaba.jpg' },
  { slug: 'mahela-hou-drade-heel', title: 'Mahela hou drade heel', date: '2021-07-29', lang: 'af', excerpt: 'An Afrikaans press clipping on Mahela.', image: 'press/290721lnm062-2.jpg' },
  { slug: 'in-n-blik', title: 'In ’n blik', date: '2021-07-29', lang: 'af', excerpt: 'An Afrikaans press clipping featuring Mahela.', image: 'press/220721lnm005-grey.jpg' },
  { slug: 'sowing-a-seed-of-success', title: 'Sowing a seed of success', date: '2019-08-14', source: 'Drum', url: 'https://m.news24.com/Drum/Sponsored-Content/sowing-a-seed-of-success-20190731-2', excerpt: 'Felsh Ndlovu works on the Mahela Group farm, one of the country’s biggest private citrus producers and exporters, based in the Lowveld region of South Africa. The 39-year-old farmer came from humble beginnings, but worked his way up and made a success of himself.', image: 'people/dscf0566.jpg' },
  { slug: 'letsitele-third-generation-business-wins-limpopo-farmer-of-the-year', title: 'Letsitele: Third generation business wins Limpopo Farmer of the Year', date: '2019-03-13', source: 'Letaba Herald', url: 'https://letabaherald.co.za/57833/letsitele-third-generation-business-wins-limpopo-farmer-year/', excerpt: 'Edward Vorster and sons from Mahela Boerdery have been selected as Limpopo Farmer of the Year and will participate in the national awards ceremony of the Agricultural Writers SA in Paarl, where the National Farmer of the Year will be announced.', image: 'people/photo-2020-10-08-12-02-42.jpg' },
  { slug: 'land-reform-is-a-success-on-this-farm-in-limpopo', title: 'Land reform is a success on this farm in Limpopo', date: '2019-03-13', source: 'City Press', url: 'https://city-press.news24.com/News/land-reform-is-a-success-on-this-farm-in-limpopo-20180829', excerpt: 'On a farm in Rietfontein a fruitful partnership aims to rewrite the story of failed land reform. “Four years ago there was nothing but untamed African bush here,” says Pieter Vorster, pointing proudly to a neat row of citrus trees on the farm Rietfontein.', image: 'farms/mahela-ohrigstad-rietfontein-3.jpg' },
];
