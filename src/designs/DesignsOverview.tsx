import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { designComponents } from './components'
import { type DesignMeta, designs } from './registry'

const THUMB_WIDTH = 1280

function Thumbnail({ design }: { design: DesignMeta }) {
  const Home = designComponents[design.slug]
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.375)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / THUMB_WIDTH))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={box} className="ov-thumb" aria-hidden="true">
      <div className="ov-thumb-inner" style={{ width: THUMB_WIDTH, transform: `scale(${scale})` }} inert>
        <Home />
      </div>
    </div>
  )
}

export function DesignsOverview() {
  return (
    <div className="ov">
      <header className="ov-header">
        <p className="ov-eyebrow">Home page directions · Round two</p>
        <h1>Nestled Reverie</h1>
        <p className="ov-lede">
          Five elegant takes on the same home page in white, blush and gold. Each uses the same words, so you’re only
          comparing type, layout and feel. Open any one, then flip through with the bar at the bottom or the ← → keys.
        </p>
      </header>

      <ol className="ov-list">
        {designs.map((d) => (
          <li key={d.slug}>
            <Link to="/designs/$slug" params={{ slug: d.slug }} className="ov-card">
              <Thumbnail design={d} />
              <div className="ov-info">
                <span className="ov-num">0{d.number}</span>
                <h2 style={{ fontFamily: d.display.family }}>{d.name}</h2>
                <span className="ov-mood">{d.mood}</span>
                <p>{d.description}</p>
                <div className="ov-swatches">
                  {d.swatches.map((s) => (
                    <span key={s.name} title={`${s.name} ${s.hex}`}>
                      <i style={{ background: s.hex }} />
                      {s.name}
                    </span>
                  ))}
                </div>
                <div className="ov-type">
                  <span style={{ fontFamily: d.display.family }}>Aa</span>
                  <div>
                    <strong>{d.display.label}</strong>
                    <span>{d.body.label}</span>
                  </div>
                </div>
                <span className="ov-open">Open this design →</span>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <footer className="ov-footer">
        Shortcuts on any design: <kbd>←</kbd> <kbd>→</kbd> to flip, <kbd>1</kbd>–<kbd>5</kbd> to jump, <kbd>H</kbd> to
        hide the bar.
      </footer>
    </div>
  )
}
