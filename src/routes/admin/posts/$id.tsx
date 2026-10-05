import { createFileRoute, Link, notFound, useBlocker, useRouter } from '@tanstack/react-router'
import { ArrowLeft, ImagePlus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '#/admin/Editor'
import { TagInput } from '#/admin/TagInput'
import { uploadImage } from '#/admin/upload'
import { adminAllTags, adminDeletePost, adminGetPost, adminSavePost, type SavePostInput } from '#/server/posts'

export const Route = createFileRoute('/admin/posts/$id')({
  loader: async ({ params }) => {
    const [post, allTags] = await Promise.all([adminGetPost({ data: Number(params.id) }), adminAllTags()])
    if (!post) throw notFound()
    return { post, allTags }
  },
  // A fresh copy every time the page opens, never a cached one.
  staleTime: 0,
  gcTime: 0,
  component: EditPost,
})

type Draft = Omit<SavePostInput, 'id'>
type SaveState = 'saved' | 'unsaved' | 'saving' | 'error'

function EditPost() {
  const { post, allTags } = Route.useLoaderData()
  const router = useRouter()

  const [draft, setDraft] = useState<Draft>({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    tags: post.tags.map((t) => t.name),
    status: post.status,
  })
  const [slug, setSlug] = useState(post.slug)
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [coverBusy, setCoverBusy] = useState(false)
  const latest = useRef(draft)
  latest.current = draft

  const update = useCallback((patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }))
    setSaveState('unsaved')
  }, [])
  const setContent = useCallback((content: string) => update({ content }), [update])

  const save = useCallback(
    async (patch: Partial<Draft> = {}) => {
      const next = { ...latest.current, ...patch }
      setDraft(next)
      setSaveState('saving')
      try {
        const res = await adminSavePost({ data: { id: post.id, ...next } })
        setSlug(res.slug)
        // Only mark saved if nothing changed while the save was in flight.
        setSaveState(latest.current === next ? 'saved' : 'unsaved')
        return true
      } catch {
        setSaveState('error')
        return false
      }
    },
    [post.id],
  )

  // Drafts save themselves a moment after you stop typing.
  // Published essays wait for "Update" so half-finished edits never go live.
  useEffect(() => {
    if (saveState !== 'unsaved' || draft.status !== 'draft') return
    const t = setTimeout(() => void save(), 1200)
    return () => clearTimeout(t)
  }, [draft, saveState, save])

  // ⌘S / Ctrl+S saves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        void save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save])

  useBlocker({
    shouldBlockFn: () => !window.confirm('You have changes that are not saved yet. Leave anyway?'),
    enableBeforeUnload: () => saveState === 'unsaved' || saveState === 'saving',
    disabled: saveState === 'saved',
  })

  async function chooseCover(file: File | undefined) {
    if (!file) return
    setCoverBusy(true)
    try {
      update({ coverImage: await uploadImage(file) })
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'That image could not be uploaded.')
    } finally {
      setCoverBusy(false)
    }
  }

  async function publish() {
    if (!draft.title.trim()) {
      window.alert('Give the essay a title before publishing.')
      return
    }
    await save({ status: 'published' })
  }

  async function unpublish() {
    if (window.confirm('Take this essay off the site? It will be kept here as a draft.')) {
      await save({ status: 'draft' })
    }
  }

  async function remove() {
    if (!window.confirm('Delete this essay for good? This cannot be undone.')) return
    setSaveState('saved')
    await adminDeletePost({ data: post.id })
    router.navigate({ to: '/admin' })
  }

  const published = draft.status === 'published'
  const statusText =
    saveState === 'saving'
      ? 'Saving…'
      : saveState === 'error'
        ? 'Could not save. Check your connection and try again.'
        : saveState === 'unsaved'
          ? published
            ? 'Changes not live yet'
            : 'Unsaved changes'
          : published
            ? 'Live on the site'
            : 'Draft saved'

  return (
    <div className="ad-write">
      <header className="ad-bar ad-bar-sticky">
        <Link to="/admin" className="ad-link ad-back">
          <ArrowLeft /> All essays
        </Link>
        <div className="ad-bar-right">
          <span className="ad-status" data-state={saveState}>
            {statusText}
          </span>
          {published ? (
            <>
              <a href={`/journal/${slug}`} target="_blank" rel="noreferrer" className="ad-link">
                View
              </a>
              <button type="button" className="ad-btn" onClick={unpublish}>
                Unpublish
              </button>
              <button
                type="button"
                className="ad-btn ad-btn-gold"
                onClick={() => save()}
                disabled={saveState !== 'unsaved' && saveState !== 'error'}
              >
                Update
              </button>
            </>
          ) : (
            <button type="button" className="ad-btn ad-btn-gold" onClick={publish}>
              Publish
            </button>
          )}
        </div>
      </header>

      <div className="ad-page">
        <label className="ad-cover" data-has={!!draft.coverImage}>
          {draft.coverImage ? (
            <img src={draft.coverImage} alt="" />
          ) : (
            <span className="ad-cover-empty">
              <ImagePlus />
              {coverBusy ? 'Adding…' : 'Add a cover photo'}
            </span>
          )}
          <input type="file" accept="image/*" hidden onChange={(e) => chooseCover(e.target.files?.[0])} />
        </label>
        {draft.coverImage && (
          <div className="ad-cover-actions">
            <button type="button" className="ad-link" onClick={() => update({ coverImage: '' })}>
              Remove cover
            </button>
          </div>
        )}

        <AutoTextarea
          className="ad-title"
          placeholder="Title"
          value={draft.title}
          onChange={(title) => update({ title })}
        />
        <AutoTextarea
          className="ad-excerpt"
          placeholder="A line or two that invites the reader in"
          value={draft.excerpt}
          onChange={(excerpt) => update({ excerpt })}
        />
        <TagInput value={draft.tags} onChange={(tags) => update({ tags })} suggestions={allTags.map((t) => t.name)} />
        <p className="ad-url">
          /journal/<strong>{slug.startsWith('draft-') ? '…' : slug}</strong>
        </p>

        <Editor content={post.content} onChange={setContent} />

        <div className="ad-danger">
          <button type="button" className="ad-link" onClick={remove}>
            Delete this essay
          </button>
        </div>
      </div>
    </div>
  )
}

function AutoTextarea({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  className: string
  placeholder: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  // biome-ignore lint/correctness/useExhaustiveDependencies: resize whenever the text changes
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])
  return (
    <textarea
      ref={ref}
      rows={1}
      className={className}
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\n/g, ' '))}
    />
  )
}
