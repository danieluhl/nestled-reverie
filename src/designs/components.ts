import type { ComponentType } from 'react'
import GildedScriptHome from './gilded-script/Home'
import IvoryGalleryHome from './ivory-gallery/Home'
import MaisonBlushHome from './maison-blush/Home'
import RoseAndGoldHome from './rose-and-gold/Home'
import TheLongReadHome from './the-long-read/Home'

export const designComponents: Record<string, ComponentType> = {
  'maison-blush': MaisonBlushHome,
  'gilded-script': GildedScriptHome,
  'ivory-gallery': IvoryGalleryHome,
  'rose-and-gold': RoseAndGoldHome,
  'the-long-read': TheLongReadHome,
}
