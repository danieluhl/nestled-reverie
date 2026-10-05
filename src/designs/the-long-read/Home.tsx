import { featured, nav, recent, site, themes } from '../content'
import { Plate } from '../Plate'

function Ornament() {
  return (
    <div className="lr-ornament" aria-hidden="true">
      <span />
      <svg viewBox="0 0 40 24">
        <path d="M20 22 C16 16 16 8 20 2 C24 8 24 16 20 22 Z" />
        <path d="M20 22 C14 19 9 14 8 8 C13 10 18 15 20 22 Z" />
        <path d="M20 22 C26 19 31 14 32 8 C27 10 22 15 20 22 Z" />
      </svg>
      <span />
    </div>
  )
}

export default function TheLongReadHome() {
  return (
    <div className="lr">
      <header className="lr-header">
        <div className="lr-header-row lr-wrap">
          <span className="lr-small">Boston · Autumn 2026</span>
          <a href="#top" className="lr-logo">
            Nestled Reverie
          </a>
          <a href="#top" className="lr-small lr-sub">
            Subscribe
          </a>
        </div>
        <nav className="lr-nav" aria-label="Main">
          {nav.map((n) => (
            <a key={n} href="#top">
              {n}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <article className="lr-opening lr-wrap">
          <figure className="lr-figure">
            <Plate tone={featured.tone} motif={featured.motif} label="Featured photograph" />
            <figcaption>The first light of a Boston morning, before the day begins.</figcaption>
          </figure>
          <div className="lr-essay">
            <span className="lr-small lr-gold">
              The latest essay · {featured.theme} · {featured.readTime}
            </span>
            <h1>On building a career you never have to apologize for</h1>
            <p className="lr-dek">{featured.excerpt}</p>
            <div className="lr-body">
              <p className="lr-dropcap">
                For a long time I began every request with an apology. Sorry to bother you. Sorry, just a quick question.
                Sorry, I know this is a lot. I thought it was politeness, the kind my mother taught me, the kind that
                makes a room feel warm.
              </p>
              <p>
                It took me years, a move across the world and one very honest manager to understand that I was
                apologizing for taking up space I had already earned. Warmth and apology are not the same thing, and
                only one of them was serving me.
              </p>
              <p>
                What follows is not advice so much as a set of small permissions I have given myself, and would gladly
                give to you.
              </p>
            </div>
            <a href="#top" className="lr-continue">
              Continue reading
            </a>
          </div>
        </article>

        <Ornament />

        <section className="lr-wrap lr-section">
          <h2 className="lr-heading">Also in these pages</h2>
          <div className="lr-also">
            {recent.slice(0, 6).map((p) => (
              <a key={p.slug} href="#top">
                <span className="lr-small lr-gold">{p.theme}</span>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="lr-quote">
          <blockquote>{site.quote}</blockquote>
        </section>

        <section className="lr-wrap lr-section lr-contents-wrap">
          <h2 className="lr-heading">Contents</h2>
          <ol className="lr-contents">
            {themes.map((t) => (
              <li key={t.name}>
                <a href="#top">
                  <span className="lr-contents-name">{t.name}</span>
                  <span className="lr-leader" aria-hidden="true" />
                  <span className="lr-contents-blurb">{t.blurb}</span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="lr-letter">
          <div className="lr-letter-inner">
            <span className="lr-small lr-gold">A letter from the author</span>
            <p className="lr-letter-open">Dear reader,</p>
            <p>{site.intro}</p>
            <p>Thank you for being here. Stay as long as you like.</p>
            <p className="lr-signoff">{site.signature}</p>
            <p className="lr-signature">Nestled Reverie</p>
          </div>
        </section>

        <section className="lr-wrap lr-news">
          <Ornament />
          <h2>{site.newsletterTitle}</h2>
          <p>{site.newsletterText}</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
        </section>
      </main>

      <footer className="lr-footer lr-wrap">
        <span className="lr-logo lr-logo-small">Nestled Reverie</span>
        <span>{site.tagline}</span>
        <span className="lr-small">© 2026</span>
      </footer>
    </div>
  )
}
