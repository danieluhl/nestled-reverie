import { Link } from '@tanstack/react-router'
import { site } from './content'
import { Cover } from './Cover'
import { formatDate } from './format'
import { Divider } from './Layout'

export interface ArticleProps {
  id: number
  title: string
  excerpt: string
  content: string
  coverImage: string
  publishedAt: string | null
  readTime: string
  tags: { name: string; slug: string }[]
}

/** One essay as readers see it. The editor's preview uses the same component. */
export function PostArticle({ post }: { post: ArticleProps }) {
  return (
    <article className="gs-post">
      <header className="gs-post-head">
        <span className="gs-label">
          {formatDate(post.publishedAt ?? new Date().toISOString())} · {post.readTime}
        </span>
        <h1>{post.title || 'Untitled'}</h1>
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
  )
}
