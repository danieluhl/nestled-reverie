import { featured, nav, recent, site, themes } from '../content'
import { Plate } from '../Plate'

function Lotus() {
  return (
    <svg viewBox="0 0 40 24" className="gs-lotus" aria-hidden="true">
      <path d="M20 22 C16 16 16 8 20 2 C24 8 24 16 20 22 Z" />
      <path d="M20 22 C14 19 9 14 8 8 C13 10 18 15 20 22 Z" />
      <path d="M20 22 C26 19 31 14 32 8 C27 10 22 15 20 22 Z" />
    </svg>
  )
}

function Divider() {
  return (
    <div className="gs-divider" aria-hidden="true">
      <span />
      <Lotus />
      <span />
    </div>
  )
}

export default function GildedScriptHome() {
  const rows = recent.slice(0, 3)
  const left = nav.slice(0, 2)
  const right = nav.slice(2, 4)
  return (
    <div className="gs">
      <header className="gs-header">
        <nav className="gs-nav gs-nav-left" aria-label="Main">
          {left.map((n) => (
            <a key={n} href="#top">
              {n}
            </a>
          ))}
        </nav>
        <a href="#top" className="gs-logo">
          Nestled Reverie
        </a>
        <nav className="gs-nav gs-nav-right" aria-label="More">
          {right.map((n) => (
            <a key={n} href="#top">
              {n}
            </a>
          ))}
        </nav>
      </header>
      <Divider />

      <main>
        <section className="gs-hero">
          <span className="gs-label">Welcome</span>
          <h1>
            Between two worlds, <em>at home in both.</em>
          </h1>
          <p>{site.tagline}</p>
        </section>

        <section className="gs-windows" aria-label="Featured">
          <a href="#top" className="gs-window gs-window-side">
            <Plate tone="rose" motif="moon" label="Photograph" />
          </a>
          <a href="#top" className="gs-window gs-window-main">
            <Plate tone={featured.tone} motif={featured.motif} label="Featured photograph" />
          </a>
          <a href="#top" className="gs-window gs-window-side">
            <Plate tone="gold" motif="lotus" label="Photograph" />
          </a>
        </section>

        <section className="gs-featured">
          <div className="gs-featured-card">
            <span className="gs-label">The latest essay</span>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <a href="#top" className="gs-script-link">
              continue reading
            </a>
          </div>
        </section>

        <section className="gs-section gs-wrap">
          <h2 className="gs-title">Recent reflections</h2>
          <div className="gs-rows">
            {rows.map((p) => (
              <article key={p.slug} className="gs-row">
                <a href="#top" className="gs-row-img">
                  <Plate tone={p.tone} motif={p.motif} label={p.title} />
                </a>
                <div className="gs-row-text">
                  <span className="gs-label">
                    {p.theme} · {p.readTime}
                  </span>
                  <h3>
                    <a href="#top">{p.title}</a>
                  </h3>
                  <p>{p.excerpt}</p>
                  <a href="#top" className="gs-more">
                    Read more
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="gs-quote">
          <span className="gs-script">a gentle reminder</span>
          <blockquote>{site.quote}</blockquote>
          <Divider />
        </section>

        <section className="gs-section gs-wrap">
          <h2 className="gs-title">Explore the journal</h2>
          <div className="gs-themes">
            {themes.map((t) => (
              <a key={t.name} href="#top" className="gs-theme">
                <div className="gs-theme-img">
                  <Plate tone={t.tone} motif={t.motif} label={t.name} />
                </div>
                <h3>{t.name}</h3>
                <p>{t.blurb}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="gs-about gs-wrap">
          <div className="gs-about-img">
            <Plate tone="blush" motif="veil" label="Portrait" />
          </div>
          <div className="gs-about-text">
            <span className="gs-label">About</span>
            <h2>Hello, dear reader.</h2>
            <p>{site.intro}</p>
            <span className="gs-script gs-sign">{site.signature}</span>
          </div>
        </section>

        <section className="gs-letter">
          <span className="gs-script gs-letter-title">{site.newsletterTitle}</span>
          <p>{site.newsletterText}</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
        </section>
      </main>

      <footer className="gs-footer">
        <Divider />
        <span className="gs-logo gs-logo-small">Nestled Reverie</span>
        <nav aria-label="Footer">
          {nav.map((n) => (
            <a key={n} href="#top">
              {n}
            </a>
          ))}
        </nav>
        <span className="gs-copy">© 2026 · Written in Boston</span>
      </footer>
    </div>
  )
}
