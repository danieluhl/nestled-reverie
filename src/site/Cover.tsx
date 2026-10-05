import { Plate, type PlateMotif, type PlateTone } from './Plate'

const tones: PlateTone[] = ['blush', 'rose', 'ivory', 'gold']
const motifs: PlateMotif[] = ['arch', 'moon', 'lotus', 'horizon', 'veil']

/** A post's cover photograph, or a soft placeholder that stays the same for that post. */
export function Cover({ src, seed, label }: { src?: string; seed: number; label: string }) {
  if (src) return <img className="cover-img" src={src} alt={label} loading="lazy" />
  return <Plate tone={tones[seed % tones.length]} motif={motifs[seed % motifs.length]} label={label} />
}

export function plateFor(seed: number) {
  return { tone: tones[seed % tones.length], motif: motifs[(seed + 2) % motifs.length] }
}
