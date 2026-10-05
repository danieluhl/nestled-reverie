import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { logout } from '#/server/auth'
import { adminCreatePost, adminListPosts } from '#/server/posts'
import { Cover } from '#/site/Cover'
import { formatDate } from '#/site/format'

export const Route = createFileRoute('/admin/')({
  loader: () => adminListPosts(),
  component: Desk,
})

type Filter = 'all' | 'draft' | 'published'

function Desk() {
  const posts = Route.useLoaderData()
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')
  const [creating, setCreating] = useState(false)
  const shown = filter === 'all' ? posts : posts.filter((p) => p.status === filter)

  async function newPost() {
    setCreating(true)
    const { id } = await adminCreatePost()
    router.navigate({ to: '/admin/posts/$id', params: { id: String(id) } })
  }

  async function signOut() {
    await logout()
    router.navigate({ to: '/admin/login' })
  }

  return (
    <div className="ad-desk">
      <header className="ad-bar">
        <span className="ad-logo ad-logo-small">Nestled Reverie</span>
        <div className="ad-bar-right">
          <a href="/" target="_blank" rel="noreferrer" className="ad-link">
            View site
          </a>
          <button type="button" className="ad-link" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      <div className="ad-desk-head">
        <h1>Your essays</h1>
        <button type="button" className="ad-btn ad-btn-gold" onClick={newPost} disabled={creating}>
          {creating ? 'Opening…' : 'Write something new'}
        </button>
      </div>

      <div className="ad-segment" role="tablist">
        {(['all', 'draft', 'published'] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'draft' ? 'Drafts' : 'Published'}
            <span>{f === 'all' ? posts.length : posts.filter((p) => p.status === f).length}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="ad-empty">
          {posts.length === 0 ? 'Nothing here yet. Your first essay is one click away.' : 'Nothing in this list.'}
        </p>
      ) : (
        <ul className="ad-list">
          {shown.map((p) => (
            <li key={p.id}>
              <Link to="/admin/posts/$id" params={{ id: String(p.id) }} className="ad-row">
                <div className="ad-row-img">
                  <Cover src={p.coverImage} seed={p.id} label="" />
                </div>
                <div className="ad-row-text">
                  <h2>{p.title || 'Untitled'}</h2>
                  <span className="ad-meta">
                    <span className="ad-pill" data-status={p.status}>
                      {p.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    {p.status === 'published' ? formatDate(p.publishedAt) : `Edited ${formatDate(p.updatedAt)}`}
                    {p.tags.length > 0 && <> · {p.tags.map((t) => t.name).join(', ')}</>}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
