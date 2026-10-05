import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getPost } from '#/server/posts'
import { site } from '#/site/content'
import { Cover } from '#/site/Cover'
import { formatDate } from '#/site/format'
import { Divider, SiteLayout } from '#/site/Layout'

export const Route = createFileRoute('/journal/$slug')({
  loader: async ({ params }) => {
    const post = await getPost({ data: params.slug })
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData: post }) => ({
    meta: post
      ? [
          { title: `${post.title} · Nestled Reverie` },
          { name: 'description', content: post.excerpt || site.description },
          { property: 'og:title', content: post.title },
          { property: 'og:description', content: post.excerpt || site.description },
          ...(post.coverImage ? [{ property: 'og:image', content: post.coverImage }] : []),
        ]
      : [],
  }),
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()
  return (
    <SiteLayout>
      <article className="gs-post">
        <header className="gs-post-head">
          <span className="gs-label">
            {formatDate(post.publishedAt)} · {post.readTime}
          </span>
          <h1>{post.title}</h1>
          {post.excerpt && <p>{post.excerpt}</p>}
        </header>

        <div className="gs-post-cover">
          <Cover src={post.coverImage} seed={post.id} label={post.title} />
        </div>

        {/* Written in the admin editor, which only the author can reach. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted HTML from the admin editor */}
        <div className="gs-prose" dangerouslySetInnerHTML={{ __html: post.content }} />

        <footer className="gs-post-foot">
          <span className="gs-script gs-sign">{site.signature}</span>
          {post.tags.length > 0 && (
            <div className="gs-card-tags">
              {post.tags.map((t) => (
                <Link key={t.slug} to="/journal" search={{ tag: t.slug }}>
                  {t.name}
                </Link>
              ))}
            </div>
          )}
          <Divider />
          <Link to="/journal" className="gs-more">
            More essays
          </Link>
        </footer>
      </article>
    </SiteLayout>
  )
}
