import { featured, letters, nav, recent, site, themes } from '../content'
import { Plate } from '../Plate'

export default function RoseAndGoldHome() {
  const cards = recent.slice(0, 3)
  return (
    <div className="rg">
      <div className="rg-announce">
        New essay: <a href="#top">{featured.title}</a>
      </div>

      <header className="rg-header">
        <a href="#top" className="rg-logo">
          Nestled Reverie
        </a>
        <nav aria-label="Main">
          {nav.map((n) => (
            <a key={n} href="#top">
              {n}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="rg-hero">
          <div className="rg-hero-inner rg-wrap">
            <div className="rg-hero-text">
              <span className="rg-label">The latest essay</span>
              <h1>{featured.title}</h1>
              <p>{featured.excerpt}</p>
              <a href="#top" className="rg-button">
                Read the essay
              </a>
            </div>
            <a href="#top" className="rg-hero-img">
              <Plate tone="ivory" motif={featured.motif} label="Featured photograph" />
            </a>
          </div>
        </section>

        <section className="rg-wrap rg-section">
          <div className="rg-head">
            <h2>Recently</h2>
            <a href="#top">View all</a>
          </div>
          <div className="rg-cards">
            {cards.map((p) => (
              <a key={p.slug} href="#top" className="rg-card">
                <div className="rg-card-img">
                  <Plate tone={p.tone} motif={p.motif} label={p.title} />
                </div>
                <span className="rg-label">{p.theme}</span>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="rg-letters">
          <div className="rg-wrap rg-letters-inner">
            <div className="rg-letters-intro">
              <span className="rg-label">Letters &amp; Questions</span>
              <h2>
                Advice, <em>gently given.</em>
              </h2>
              <p>
                Questions from readers about careers, motherhood and raising a family between two cultures, answered with
                care.
              </p>
              <a href="#top" className="rg-button">
                Write to me
              </a>
            </div>
            <div className="rg-letters-list">
              {letters.map((l) => (
                <article key={l.question}>
                  <h3>{l.question}</h3>
                  <p>{l.answer}</p>
                  <a href="#top" className="rg-link">
                    Read the full letter
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rg-wrap rg-section">
          <div className="rg-head">
            <h2>Explore</h2>
          </div>
          <div className="rg-themes">
            {themes.map((t) => (
              <a key={t.name} href="#top" className="rg-theme">
                <Plate tone={t.tone} motif={t.motif} label={t.name} />
                <div className="rg-theme-label">
                  <h3>{t.name}</h3>
                  <p>{t.blurb}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="rg-quote">
          <div className="rg-wrap">
            <span className="rg-rule" aria-hidden="true" />
            <blockquote>{site.quote}</blockquote>
            <span className="rg-rule" aria-hidden="true" />
          </div>
        </section>

        <section className="rg-wrap rg-section rg-closing">
          <div className="rg-about">
            <div className="rg-about-img">
              <Plate tone="blush" motif="veil" label="Portrait" />
            </div>
            <div>
              <span className="rg-label">About</span>
              <h2>{site.statement}</h2>
              <p>{site.intro}</p>
              <a href="#top" className="rg-link">
                My story
              </a>
            </div>
          </div>
          <div className="rg-letter">
            <span className="rg-label">The newsletter</span>
            <h2>{site.newsletterTitle}</h2>
            <p>{site.newsletterText}</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email address" aria-label="Email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="rg-footer">
        <div className="rg-wrap rg-footer-inner">
          <span className="rg-logo rg-logo-small">Nestled Reverie</span>
          <nav aria-label="Footer">
            {nav.map((n) => (
              <a key={n} href="#top">
                {n}
              </a>
            ))}
          </nav>
          <span className="rg-copy">© 2026 Nestled Reverie</span>
        </div>
      </footer>
    </div>
  )
}
