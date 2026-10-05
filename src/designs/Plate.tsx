import { useId } from 'react'

// A soft, abstract stand-in for photography: tonal blush, ivory and gold washes
// with a fine gold line motif and a whisper of grain. Real photographs replace these later.

export type PlateTone = 'blush' | 'rose' | 'ivory' | 'gold'
export type PlateMotif = 'arch' | 'moon' | 'lotus' | 'horizon' | 'veil'

interface PlateProps {
  tone: PlateTone
  motif?: PlateMotif
  className?: string
  label?: string
  /** where the line motif sits in wide frames */
  align?: 'center' | 'right'
}

export function Plate({ tone, motif = 'veil', className, label, align = 'center' }: PlateProps) {
  const grainId = `grain-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const line = {
    fill: 'none',
    stroke: 'var(--plate-line, #B08D57)',
    strokeWidth: 1.25,
    vectorEffect: 'non-scaling-stroke' as const,
    strokeLinecap: 'round' as const,
  }

  return (
    <div className={`plate plate--${tone}${className ? ` ${className}` : ''}`} role="img" aria-label={label ?? 'Photograph'}>
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.3  0 0 0 0.9 0" />
        </filter>
        <rect width="400" height="500" filter={`url(#${grainId})`} opacity="0.07" />
      </svg>
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio={align === 'right' ? 'xMaxYMid meet' : 'xMidYMid meet'}
        aria-hidden="true"
      >
        {motif === 'arch' && (
          <>
            <path d="M142 352 V232 A58 58 0 0 1 258 232 V352" {...line} />
            <path d="M154 352 V234 A46 46 0 0 1 246 234 V352" {...line} opacity="0.45" />
            <path d="M118 352 H282" {...line} />
          </>
        )}
        {motif === 'moon' && (
          <>
            <circle cx="200" cy="238" r="54" {...line} />
            <circle cx="200" cy="238" r="54" fill="#fff" opacity="0.35" stroke="none" />
            <path d="M112 330 H288" {...line} />
            <path d="M146 344 H254" {...line} opacity="0.45" />
          </>
        )}
        {motif === 'lotus' && (
          <>
            <path d="M200 332 C182 292 182 236 200 196 C218 236 218 292 200 332 Z" {...line} />
            <path d="M200 332 C168 312 142 274 140 238 C168 250 192 284 200 332 Z" {...line} />
            <path d="M200 332 C232 312 258 274 260 238 C232 250 208 284 200 332 Z" {...line} />
            <path d="M198 334 C160 332 124 314 108 290 C142 284 178 302 198 334" {...line} opacity="0.6" />
            <path d="M202 334 C240 332 276 314 292 290 C258 284 222 302 202 334" {...line} opacity="0.6" />
            <path d="M146 350 Q200 360 254 350" {...line} />
          </>
        )}
        {motif === 'horizon' && (
          <>
            <path d="M174 302 A26 26 0 0 1 226 302" {...line} />
            <path d="M96 302 H304" {...line} />
            <path d="M134 318 H266" {...line} opacity="0.5" />
            <path d="M168 332 H232" {...line} opacity="0.3" />
          </>
        )}
      </svg>
    </div>
  )
}
