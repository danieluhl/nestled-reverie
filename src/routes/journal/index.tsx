import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { listPosts, listTags, type Sort, sorts } from '#/server/posts'
import { Cover } from '#/site/Cover'
import { formatDate } from '#/site/format'
import { SiteLayout } from '#/site/Layout'

interface Search {
  tag?: string
  sort?: Sort
}

export const Route = createFileRoute('/journal/')({
  validateSearch: (s: Record<string, unknown>): Search => ({
    tag: typeof s.tag === 'string' && s.tag ? s.tag : undefined,
    sort: sorts.some((o) => o.value === s.sort) && s.sort !== 'newest' ? (s.sort as Sort) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [posts, tags] = await Promise.all([listPosts({ data: deps }), listTags()])
    return { posts, tags }
  },
  head: () => ({ meta: [{ title: 'Journal · Nestled Reverie' }] }),
  component: Journal,
})

function Journal() {
  const { posts, tags } = Route.useLoaderData()
  const { tag, sort = 'newest' } = Route.useSearch()
  const navigate = useNavigate({ from: '/journal/' })
  const active = tags.find((t) => t.slug === tag)

  return (
    <SiteLayout>
      <section className="gs-hero gs-hero-small">
        <span className="gs-label">The journal</span>
        <h1>{active ? <em>{active.name}</em> : 'Every essay'}</h1>
      </section>

      <div className="gs-wrap">
        <div className="gs-filters">
          <nav className="gs-tags" aria-label="Filter by topic">
            <Link to="/journal" search={(s) => ({ ...s, tag: undefined })} className="gs-tag" data-active={!tag}>
              All
            </Link>
            {tags.map((t) => (
              <Link
                key={t.slug}
                to="/journal"
                search={(s) => ({ ...s, tag: t.slug })}
                className="gs-tag"
                data-active={t.slug === tag}
              >
                {t.name}
              </Link>
            ))}
          </nav>
          <label className="gs-sort">
            <span>Sort</span>
            <select
              value={sort}
              onChange={(e) =>
                navigate({
                  search: (s) => ({ ...s, sort: e.target.value === 'newest' ? undefined : (e.target.value as Sort) }),
                })
              }
            >
              {sorts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {posts.length === 0 ? (
          <p className="gs-empty">No essays here yet.</p>
        ) : (
          <div className="gs-grid">
            {posts.map((p) => (
              <article key={p.id} className="gs-card">
                <Link to="/journal/$slug" params={{ slug: p.slug }} className="gs-card-img">
                  <Cover src={p.coverImage} seed={p.id} label={p.title} />
                </Link>
                <span className="gs-label">{formatDate(p.publishedAt)}</span>
                <h2>
                  <Link to="/journal/$slug" params={{ slug: p.slug }}>
                    {p.title}
                  </Link>
                </h2>
                <p>{p.excerpt}</p>
                {p.tags.length > 0 && (
                  <div className="gs-card-tags">
                    {p.tags.map((t) => (
                      <Link key={t.slug} to="/journal" search={(s) => ({ ...s, tag: t.slug })}>
                        {t.name}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  )
}
