import { createFileRoute, Link } from '@tanstack/react-router'
import { listPosts, listTags } from '#/server/posts'
import { site } from '#/site/content'
import { Cover, plateFor } from '#/site/Cover'
import { Divider, SiteLayout } from '#/site/Layout'
import { Plate } from '#/site/Plate'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [posts, tags] = await Promise.all([listPosts({ data: { sort: 'newest', limit: 4 } }), listTags()])
    return { posts, tags }
  },
  component: Home,
})

function Home() {
  const { posts, tags } = Route.useLoaderData()
  const [featured, ...recent] = posts
  const topics = tags.slice(0, 4)

  return (
    <SiteLayout>
      <section className="gs-hero">
        <span className="gs-label">Welcome</span>
        <h1>
          {site.statementStart} <em>{site.statementEnd}</em>
        </h1>
        <p>{site.tagline}</p>
      </section>

      <section className="gs-windows" aria-label="Featured">
        <div className="gs-window gs-window-side">
          <Cover src={recent[0]?.coverImage} seed={1} label={recent[0]?.title ?? 'Photograph'} />
        </div>
        <Link
          to={featured ? '/journal/$slug' : '/journal'}
          params={featured ? { slug: featured.slug } : undefined}
          className="gs-window gs-window-main"
        >
          <Cover src={featured?.coverImage} seed={0} label={featured?.title ?? 'Photograph'} />
        </Link>
        <div className="gs-window gs-window-side">
          <Cover src={recent[1]?.coverImage} seed={3} label={recent[1]?.title ?? 'Photograph'} />
        </div>
      </section>

      <section className="gs-featured">
        <div className="gs-featured-card">
          {featured ? (
            <>
              <span className="gs-label">The latest essay</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <Link to="/journal/$slug" params={{ slug: featured.slug }} className="gs-script-link">
                continue reading
              </Link>
            </>
          ) : (
            <>
              <span className="gs-label">The journal</span>
              <h2>The first essay is on its way.</h2>
              <span className="gs-script-link">soon</span>
            </>
          )}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="gs-section gs-wrap">
          <h2 className="gs-title">Recent reflections</h2>
          <div className="gs-rows">
            {recent.map((p) => (
              <article key={p.id} className="gs-row">
                <Link to="/journal/$slug" params={{ slug: p.slug }} className="gs-row-img">
                  <Cover src={p.coverImage} seed={p.id} label={p.title} />
                </Link>
                <div className="gs-row-text">
                  <span className="gs-label">
                    {p.tags[0] ? `${p.tags[0].name} · ` : ''}
                    {p.readTime}
                  </span>
                  <h3>
                    <Link to="/journal/$slug" params={{ slug: p.slug }}>
                      {p.title}
                    </Link>
                  </h3>
                  <p>{p.excerpt}</p>
                  <Link to="/journal/$slug" params={{ slug: p.slug }} className="gs-more">
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="gs-center">
            <Link to="/journal" className="gs-more">
              All essays
            </Link>
          </div>
        </section>
      )}

      <section className="gs-quote">
        <span className="gs-script">a gentle reminder</span>
        <blockquote>{site.quote}</blockquote>
        <Divider />
      </section>

      {topics.length > 0 && (
        <section className="gs-section gs-wrap" id="topics">
          <h2 className="gs-title">Explore the journal</h2>
          <div className="gs-themes">
            {topics.map((t, i) => {
              const plate = plateFor(i)
              return (
                <Link key={t.slug} to="/journal" search={{ tag: t.slug }} className="gs-theme">
                  <div className="gs-theme-img">
                    <Plate tone={plate.tone} motif={plate.motif} label={t.name} />
                  </div>
                  <h3>{t.name}</h3>
                  <p>
                    {t.count} {t.count === 1 ? 'essay' : 'essays'}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section className="gs-about gs-wrap" id="about">
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

    </SiteLayout>
  )
}
