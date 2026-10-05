import gildedCss from './gilded-script/styles.css?url'
import ivoryCss from './ivory-gallery/styles.css?url'
import maisonCss from './maison-blush/styles.css?url'
import overviewCss from './overview.css?url'
import platesCss from './plates.css?url'
import { allFontsHref } from './registry'
import roseCss from './rose-and-gold/styles.css?url'
import switcherCss from './switcher.css?url'
import longReadCss from './the-long-read/styles.css?url'

// All design stylesheets are scoped to their own class prefix, so loading
// them together is safe and makes flipping between designs instant.
export const designLinks = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
  { rel: 'stylesheet', href: allFontsHref },
  ...[platesCss, maisonCss, gildedCss, ivoryCss, roseCss, longReadCss, switcherCss, overviewCss].map((href) => ({
    rel: 'stylesheet',
    href,
  })),
]
