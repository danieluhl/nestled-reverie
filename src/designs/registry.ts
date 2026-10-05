// The five design directions, in the order the switcher walks through them.

export interface DesignMeta {
  slug: string
  number: number
  name: string
  mood: string
  description: string
  display: { family: string; label: string }
  body: { family: string; label: string }
  swatches: { name: string; hex: string }[]
}

const gf = (families: string[]) =>
  `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join('&')}&display=swap`

/** Every family used by any design. Browsers only download the faces a page actually uses. */
export const allFontsHref = gf([
  'Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700',
  'Mulish:wght@300..600',
  'Pinyon+Script',
  'Cormorant+Garamond:ital,wght@0,300..600;1,300..600',
  'Marcellus',
  'Hanken+Grotesk:wght@300..600',
  'Tenor+Sans',
  'Newsreader:ital,opsz,wght@0,6..72,300..500;1,6..72,300..500',
  'Italiana',
  'Crimson+Pro:ital,wght@0,300..500;1,300..500',
])

export const designs: DesignMeta[] = [
  {
    slug: 'maison-blush',
    number: 1,
    name: 'Maison Blush',
    mood: 'Fashion-editorial',
    description:
      'A high-fashion magazine cover sensibility: a tall, high-contrast Didone masthead, generous white space, blush imagery and fine gold rules.',
    display: { family: "'Bodoni Moda', serif", label: 'Bodoni Moda' },
    body: { family: "'Mulish', sans-serif", label: 'Mulish' },
    swatches: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Blush', hex: '#F5E2DC' },
      { name: 'Antique gold', hex: '#B08D57' },
      { name: 'Deep gold', hex: '#8A6A3B' },
      { name: 'Ink', hex: '#2B2424' },
    ],
  },
  {
    slug: 'gilded-script',
    number: 2,
    name: 'Gilded Script',
    mood: 'Romantic and flowing',
    description:
      'Soft pink paper, a gold calligraphic signature and a delicate Garamond. Centered, symmetrical and graceful, with arched windows for photographs.',
    display: { family: "'Cormorant Garamond', serif", label: 'Cormorant Garamond' },
    body: { family: "'Pinyon Script', cursive", label: 'Pinyon Script (accents)' },
    swatches: [
      { name: 'Petal', hex: '#FBF1EE' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Rose', hex: '#D9A8A4' },
      { name: 'Gold leaf', hex: '#B89259' },
      { name: 'Cocoa ink', hex: '#3A2E2C' },
    ],
  },
  {
    slug: 'ivory-gallery',
    number: 3,
    name: 'Ivory Gallery',
    mood: 'Modern minimal',
    description:
      'A white gallery wall. Classical inscription capitals, a clean grotesque, a single gold hairline and very little else. Calm, modern and confident.',
    display: { family: "'Marcellus', serif", label: 'Marcellus' },
    body: { family: "'Hanken Grotesk', sans-serif", label: 'Hanken Grotesk' },
    swatches: [
      { name: 'Gallery white', hex: '#FFFFFF' },
      { name: 'Ivory', hex: '#FAF6F0' },
      { name: 'Powder pink', hex: '#EFD9D4' },
      { name: 'Gold hairline', hex: '#B89B6A' },
      { name: 'Graphite', hex: '#262322' },
    ],
  },
  {
    slug: 'rose-and-gold',
    number: 4,
    name: 'Rose & Gold',
    mood: 'Quiet luxury',
    description:
      'The feel of a luxury house: wide-tracked capitals, rich blush panels, gold detailing and an elegant italic. Includes a reader letters section for advice.',
    display: { family: "'Tenor Sans', sans-serif", label: 'Tenor Sans' },
    body: { family: "'Newsreader', serif", label: 'Newsreader' },
    swatches: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Rosewater', hex: '#F3DCD7' },
      { name: 'Rose', hex: '#E4BDB7' },
      { name: 'Champagne gold', hex: '#C4A36E' },
      { name: 'Aubergine ink', hex: '#35262A' },
    ],
  },
  {
    slug: 'the-long-read',
    number: 5,
    name: 'The Long Read',
    mood: 'Literary and essay-first',
    description:
      'The home page opens straight into the latest essay, set in columns with a gold drop cap, like the first page of a beautiful book. Words first, always.',
    display: { family: "'Italiana', serif", label: 'Italiana' },
    body: { family: "'Crimson Pro', serif", label: 'Crimson Pro' },
    swatches: [
      { name: 'Paper', hex: '#FFFDFB' },
      { name: 'Blush', hex: '#F4E1DC' },
      { name: 'Gilt', hex: '#A8844E' },
      { name: 'Rose ink', hex: '#9A5F5E' },
      { name: 'Ink', hex: '#2A2322' },
    ],
  },
]

export const getDesign = (slug: string) => designs.find((d) => d.slug === slug)
