import { featured, nav, recent, site, themes } from '../content'
import { Plate } from '../Plate'

export default function MaisonBlushHome() {
  const grid = recent.slice(0, 3)
  const more = recent.slice(3, 6)
  return (
    <div className="mb">
      <div className="mb-top">
        <span>Boston</span>
        <span className="mb-top-mid">{site.tagline}</span>
        <a href="#top">Subscribe</a>
      </div>

      <header className="mb-mast">
        <a href="#top" className="mb-logo">
          Nestled Reverie
        </a>
        <nav className="mb-nav" aria-label="Main">
          {nav.map((n) => (
            <a key={n} href="#top">
              {n}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="mb-hero mb-wrap">
          <a href="#top" className="mb-hero-img">
            <Plate tone={featured.tone} motif={featured.motif} label="Featured photograph" />
          </a>
          <div className="mb-hero-text">
            <span className="mb-label">The latest essay · {featured.theme}</span>
            <h1>
              On building a career you <em>never have to apologize for</em>
            </h1>
            <p>{featured.excerpt}</p>
            <a href="#top" className="mb-read">
              Read the essay
            </a>
            <span className="mb-meta">
              {featured.date} · {featured.readTime}
            </span>
          </div>
        </section>

        <section className="mb-wrap mb-section">
          <h2 className="mb-heading">
            <span>Recent Essays</span>
          </h2>
          <div className="mb-grid">
            {grid.map((p) => (
              <article key={p.slug} className="mb-card">
                <a href="#top" className="mb-card-img">
                  <Plate tone={p.tone} motif={p.motif} label={p.title} />
                </a>
                <span className="mb-label">{p.theme}</span>
                <h3>
                  <a href="#top">{p.title}</a>
                </h3>
                <p>{p.excerpt}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-quote">
          <div className="mb-wrap">
            <span className="mb-ornament" aria-hidden="true" />
            <blockquote>{site.quote}</blockquote>
            <span className="mb-label">From the journal</span>
          </div>
        </section>

        <section className="mb-wrap mb-section">
          <h2 className="mb-heading">
            <span>In These Pages</span>
          </h2>
          <div className="mb-themes">
            {themes.map((t) => (
              <a key={t.name} href="#top" className="mb-theme">
                <h3>{t.name}</h3>
                <p>{t.blurb}</p>
                <span className="mb-more">Explore</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-wrap mb-about">
          <div className="mb-about-img">
            <Plate tone="rose" motif="veil" label="Portrait" />
          </div>
          <div className="mb-about-text">
            <span className="mb-label">Welcome</span>
            <h2>
              Hello, and <em>welcome in.</em>
            </h2>
            <p>{site.intro}</p>
            <p className="mb-sign">{site.signature}</p>
          </div>
        </section>

        <section className="mb-wrap mb-section mb-more-list">
          <h2 className="mb-heading">
            <span>Worth Reading</span>
          </h2>
          <div className="mb-list">
            {more.map((p) => (
              <a key={p.slug} href="#top">
                <span className="mb-label">{p.theme}</span>
                <h3>{p.title}</h3>
                <span className="mb-meta">{p.readTime}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-letter">
          <div className="mb-wrap mb-letter-inner">
            <h2>{site.newsletterTitle}</h2>
            <p>{site.newsletterText}</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" aria-label="Email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="mb-footer">
        <a href="#top" className="mb-footer-logo">
          Nestled Reverie
        </a>
        <nav aria-label="Footer">
          {nav.map((n) => (
            <a key={n} href="#top">
              {n}
            </a>
          ))}
        </nav>
        <span>© 2026 Nestled Reverie · Boston</span>
      </footer>
    </div>
  )
}
