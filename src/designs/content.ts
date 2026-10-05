// Shared placeholder content for the home page design directions.
// Every design renders the same words so the comparison is about look and feel.

import type { PlateMotif, PlateTone } from './Plate'

export type Theme = 'Career' | 'Motherhood' | 'Two Worlds' | 'The Considered Life'

export interface Post {
  slug: string
  title: string
  excerpt: string
  theme: Theme
  date: string
  readTime: string
  tone: PlateTone
  motif: PlateMotif
}

export const site = {
  name: 'Nestled Reverie',
  tagline: 'Reflections on work, motherhood and a life between two worlds.',
  statement: 'Between two worlds, at home in both.',
  intro:
    'I was raised in India and have built my life, my career and my family in Boston. This is a place for the things I have learned along the way, and the things I am still learning, about ambition, about raising a child, and about carrying home with you wherever you go.',
  aboutShort:
    'Marketer, mother, and a woman of two cultures, writing from Boston about the art of a considered life.',
  signature: 'With warmth,',
  quote: 'You can carry where you come from, and still choose where you are going.',
  newsletterTitle: 'Letters from Boston',
  newsletterText: 'An occasional letter with new essays and a few thoughts worth keeping. Nothing more.',
}

export const nav = ['Career', 'Motherhood', 'Two Worlds', 'Life', 'About']

export const themes: { name: Theme; blurb: string; tone: PlateTone; motif: PlateMotif }[] = [
  {
    name: 'Career',
    blurb: 'On ambition, leadership and building work that feels like your own.',
    tone: 'blush',
    motif: 'arch',
  },
  {
    name: 'Motherhood',
    blurb: 'On raising a child with intention, and on keeping part of yourself.',
    tone: 'rose',
    motif: 'moon',
  },
  {
    name: 'Two Worlds',
    blurb: 'On belonging, family and tradition, for Indians making a home in America.',
    tone: 'gold',
    motif: 'lotus',
  },
  {
    name: 'The Considered Life',
    blurb: 'On rituals, rest and the small choices that shape a life.',
    tone: 'ivory',
    motif: 'horizon',
  },
]

export const posts: Post[] = [
  {
    slug: 'a-career-without-apology',
    title: 'On building a career you never have to apologize for',
    excerpt:
      'For years I softened every ask and explained every absence. What changed was not my confidence, but my understanding of what I was actually offering.',
    theme: 'Career',
    date: 'September 28, 2026',
    readTime: '8 min read',
    tone: 'blush',
    motif: 'arch',
  },
  {
    slug: 'ambition-and-motherhood',
    title: 'Ambition and motherhood were never opposites',
    excerpt: 'The story we are told is one of trade-offs. The truth I have lived is quieter, and far more hopeful.',
    theme: 'Motherhood',
    date: 'September 21, 2026',
    readTime: '6 min read',
    tone: 'rose',
    motif: 'moon',
  },
  {
    slug: 'first-winter',
    title: 'What I wish someone had told me my first winter in America',
    excerpt: 'On loneliness, on learning a new rhythm, and on the unexpected friends who become family.',
    theme: 'Two Worlds',
    date: 'September 14, 2026',
    readTime: '7 min read',
    tone: 'ivory',
    motif: 'horizon',
  },
  {
    slug: 'two-languages',
    title: 'Raising a child between two languages',
    excerpt: 'Why we speak Hindi at the dinner table, even when it would be easier not to.',
    theme: 'Two Worlds',
    date: 'September 7, 2026',
    readTime: '5 min read',
    tone: 'gold',
    motif: 'lotus',
  },
  {
    slug: 'the-quiet-art-of-no',
    title: 'The quiet art of saying no',
    excerpt: 'A gentle, practical guide to protecting your time without losing your warmth.',
    theme: 'Career',
    date: 'August 31, 2026',
    readTime: '4 min read',
    tone: 'blush',
    motif: 'veil',
  },
  {
    slug: 'the-hours-that-are-mine',
    title: 'The morning hours that are only mine',
    excerpt: 'Before the house wakes, before the inbox fills. How one small ritual changed my days.',
    theme: 'The Considered Life',
    date: 'August 24, 2026',
    readTime: '5 min read',
    tone: 'ivory',
    motif: 'moon',
  },
  {
    slug: 'what-our-parents-gave-us',
    title: 'What our parents gave us, and what we choose to pass on',
    excerpt: 'For every Indian parent in America wondering which traditions to keep, and which to let go.',
    theme: 'Two Worlds',
    date: 'August 17, 2026',
    readTime: '9 min read',
    tone: 'rose',
    motif: 'arch',
  },
]

export const featured = posts[0]
export const recent = posts.slice(1)

export const letters = [
  {
    question: 'How do I return to work after a baby without feeling like I am starting over?',
    answer:
      'You are not starting over. You are returning with a sharper sense of what matters, and that is worth naming, to yourself first.',
  },
  {
    question: 'My parents are visiting for six months. How do we keep the peace?',
    answer: 'Begin with gratitude, agree on a few household rhythms early, and give everyone, including yourself, a room to retreat to.',
  },
]

export const principles = ['Grace over perfection', 'Roots and wings', 'Ambition, with kindness']
