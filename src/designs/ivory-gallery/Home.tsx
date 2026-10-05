import { featured, nav, posts, principles, site, themes } from '../content'
import { Plate } from '../Plate'

export default function IvoryGalleryHome() {
  return (
    <div className="ig">
      <header className="ig-header ig-wrap">
        <a href="#top" className="ig-logo">
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
        <section className="ig-hero ig-wrap">
          <h1>
            Thoughtful notes on work, motherhood <span>and belonging.</span>
          </h1>
          <div className="ig-hero-side">
            <p>{site.aboutShort}</p>
            <a href="#top" className="ig-arrow">
              Begin reading
            </a>
          </div>
        </section>

        <section className="ig-wrap">
          <a href="#top" className="ig-feature">
            <Plate
              tone={featured.tone}
              motif={featured.motif}
              align="right"
              className="ig-feature-img"
              label="Featured photograph"
            />
            <div className="ig-feature-card">
              <span className="ig-label">Latest · {featured.theme}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="ig-meta">
                {featured.date} — {featured.readTime}
              </span>
            </div>
          </a>
        </section>

        <section className="ig-wrap ig-section">
          <div className="ig-section-head">
            <h2>The Journal</h2>
            <a href="#top" className="ig-arrow">
              All essays
            </a>
          </div>
          <ol className="ig-index">
            {posts.slice(1).map((p) => (
              <li key={p.slug}>
                <a href="#top">
                  <span className="ig-meta">{p.date.replace(', 2026', '')}</span>
                  <span className="ig-index-title">{p.title}</span>
                  <span className="ig-label">{p.theme}</span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="ig-principles">
          <div className="ig-wrap">
            {principles.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </section>

        <section className="ig-wrap ig-section">
          <div className="ig-section-head">
            <h2>Themes</h2>
          </div>
          <div className="ig-themes">
            {themes.map((t) => (
              <a key={t.name} href="#top" className="ig-theme">
                <Plate tone={t.tone} motif={t.motif} className="ig-theme-img" label={t.name} />
                <h3>{t.name}</h3>
                <p>{t.blurb}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="ig-wrap ig-about">
          <div className="ig-about-text">
            <span className="ig-label">About the author</span>
            <p className="ig-about-lede">{site.intro}</p>
            <a href="#top" className="ig-arrow">
              Read more about me
            </a>
          </div>
          <Plate tone="blush" motif="arch" className="ig-about-img" label="Portrait" />
        </section>

        <section className="ig-wrap ig-letter">
          <div>
            <h2>{site.newsletterTitle}</h2>
            <p>{site.newsletterText}</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
        </section>
      </main>

      <footer className="ig-footer ig-wrap">
        <span className="ig-logo">Nestled Reverie</span>
        <span>© 2026 · Boston, Massachusetts</span>
      </footer>
    </div>
  )
}
