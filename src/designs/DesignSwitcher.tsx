import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, EyeOff, LayoutGrid } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type DesignMeta, designs } from './registry'

/**
 * Floating bar for flipping between the five home page designs.
 * Keyboard: ← / → to step, 1–5 to jump, H to hide or show the bar.
 */
export function DesignSwitcher({ current }: { current: DesignMeta }) {
  const navigate = useNavigate()
  const [hidden, setHidden] = useState(false)
  const idx = designs.findIndex((d) => d.slug === current.slug)
  const prev = designs[(idx + designs.length - 1) % designs.length]
  const next = designs[(idx + 1) % designs.length]

  useEffect(() => {
    const go = (slug: string) => navigate({ to: '/designs/$slug', params: { slug } })
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowRight') go(next.slug)
      else if (e.key === 'ArrowLeft') go(prev.slug)
      else if (/^[1-5]$/.test(e.key)) go(designs[Number(e.key) - 1].slug)
      else if (e.key.toLowerCase() === 'h') setHidden((h) => !h)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, next.slug, prev.slug])

  if (hidden) {
    return (
      <button type="button" className="nrs-mini" onClick={() => setHidden(false)} title="Show design switcher (H)">
        {current.number}/5
      </button>
    )
  }

  return (
    <div className="nrs" role="navigation" aria-label="Design options">
      <Link to="/designs" className="nrs-icon" title="All designs">
        <LayoutGrid size={17} />
      </Link>
      <Link to="/designs/$slug" params={{ slug: prev.slug }} className="nrs-icon" title={`Previous: ${prev.name} (←)`}>
        <ChevronLeft size={19} />
      </Link>
      <div className="nrs-label">
        <span className="nrs-name">
          {current.number}. {current.name}
        </span>
        <span className="nrs-mood">{current.mood}</span>
      </div>
      <div className="nrs-dots">
        {designs.map((d) => (
          <Link
            key={d.slug}
            to="/designs/$slug"
            params={{ slug: d.slug }}
            className={d.slug === current.slug ? 'nrs-dot is-active' : 'nrs-dot'}
            title={`${d.number}. ${d.name}`}
          >
            {d.number}
          </Link>
        ))}
      </div>
      <Link to="/designs/$slug" params={{ slug: next.slug }} className="nrs-icon" title={`Next: ${next.name} (→)`}>
        <ChevronRight size={19} />
      </Link>
      <button type="button" className="nrs-icon" onClick={() => setHidden(true)} title="Hide this bar (H)">
        <EyeOff size={16} />
      </button>
    </div>
  )
}
