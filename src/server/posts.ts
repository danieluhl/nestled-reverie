import { createServerFn } from '@tanstack/react-start'
import { and, asc, desc, eq, inArray, ne, sql } from 'drizzle-orm'
import { getDb } from '#/db'
import { posts, postTags, tags } from '#/db/schema'
import { requireAdmin } from './session'

export type Sort = 'newest' | 'oldest' | 'title'
export const sorts: { value: Sort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title', label: 'A to Z' },
]

export interface Tag {
  name: string
  slug: string
}

export interface PostSummary {
  id: number
  slug: string
  title: string
  excerpt: string
  coverImage: string
  publishedAt: string | null
  readTime: string
  pinned: boolean
  tags: Tag[]
}

export interface PostFull extends PostSummary {
  content: string
}

export interface AdminPost extends PostFull {
  status: 'draft' | 'published'
  updatedAt: string
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function readTime(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 230))} min read`
}

type PostRow = typeof posts.$inferSelect

async function tagsFor(ids: number[]) {
  const byPost = new Map<number, Tag[]>()
  if (!ids.length) return byPost
  const rows = await getDb()
    .select({ postId: postTags.postId, name: tags.name, slug: tags.slug })
    .from(postTags)
    .innerJoin(tags, eq(tags.id, postTags.tagId))
    .where(inArray(postTags.postId, ids))
    .orderBy(asc(tags.name))
  for (const r of rows) {
    const list = byPost.get(r.postId) ?? []
    list.push({ name: r.name, slug: r.slug })
    byPost.set(r.postId, list)
  }
  return byPost
}

function toSummary(p: PostRow, t: Map<number, Tag[]>): PostSummary {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    readTime: readTime(p.content),
    pinned: p.pinned,
    tags: t.get(p.id) ?? [],
  }
}

const isPublished = eq(posts.status, 'published')

/* ------------------------------------------------------------------ public */

export const listPosts = createServerFn()
  .validator((d: { tag?: string; sort?: Sort; limit?: number; pinnedFirst?: boolean }) => d)
  .handler(async ({ data }) => {
    const db = getDb()
    const order =
      data.sort === 'oldest'
        ? [asc(posts.publishedAt)]
        : data.sort === 'title'
          ? [asc(sql`lower(${posts.title})`)]
          : [desc(posts.publishedAt)]
    if (data.pinnedFirst) order.unshift(desc(posts.pinned))

    const where = data.tag
      ? and(
          isPublished,
          inArray(
            posts.id,
            db
              .select({ id: postTags.postId })
              .from(postTags)
              .innerJoin(tags, eq(tags.id, postTags.tagId))
              .where(eq(tags.slug, data.tag)),
          ),
        )
      : isPublished

    const rows = await db
      .select()
      .from(posts)
      .where(where)
      .orderBy(...order)
      .limit(data.limit ?? 500)
    const t = await tagsFor(rows.map((r) => r.id))
    return rows.map((r) => toSummary(r, t))
  })

/** Tags that appear on at least one published post, most used first. */
export const listTags = createServerFn().handler(async () => {
  return getDb()
    .select({ name: tags.name, slug: tags.slug, count: sql<number>`count(*)` })
    .from(tags)
    .innerJoin(postTags, eq(postTags.tagId, tags.id))
    .innerJoin(posts, eq(posts.id, postTags.postId))
    .where(isPublished)
    .groupBy(tags.id)
    .orderBy(desc(sql`count(*)`), asc(tags.name))
})

export const getPost = createServerFn()
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<PostFull | null> => {
    const [row] = await getDb()
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), isPublished))
    if (!row) return null
    const t = await tagsFor([row.id])
    return { ...toSummary(row, t), content: row.content }
  })

/* ------------------------------------------------------------------- admin */

export const adminListPosts = createServerFn().handler(async () => {
  await requireAdmin()
  const rows = await getDb().select().from(posts).orderBy(desc(posts.pinned), desc(posts.updatedAt))
  const t = await tagsFor(rows.map((r) => r.id))
  return rows.map((r) => ({
    ...toSummary(r, t),
    status: r.status,
    updatedAt: r.updatedAt.toISOString(),
  }))
})

export const adminAllTags = createServerFn().handler(async () => {
  await requireAdmin()
  return getDb().select({ name: tags.name, slug: tags.slug }).from(tags).orderBy(asc(tags.name))
})

export const adminGetPost = createServerFn()
  .validator((id: number) => Number(id))
  .handler(async ({ data: id }): Promise<AdminPost | null> => {
    await requireAdmin()
    const [row] = await getDb().select().from(posts).where(eq(posts.id, id))
    if (!row) return null
    const t = await tagsFor([row.id])
    return {
      ...toSummary(row, t),
      content: row.content,
      status: row.status,
      updatedAt: row.updatedAt.toISOString(),
    }
  })

export const adminCreatePost = createServerFn({ method: 'POST' }).handler(async () => {
  await requireAdmin()
  const [row] = await getDb()
    .insert(posts)
    .values({ slug: `draft-${crypto.randomUUID().slice(0, 8)}` })
    .returning({ id: posts.id })
  return row
})

export interface SavePostInput {
  id: number
  title: string
  excerpt: string
  content: string
  coverImage: string
  tags: string[]
  status: 'draft' | 'published'
}

async function uniqueSlug(base: string, id: number) {
  const db = getDb()
  const root = base || `essay-${id}`
  let slug = root
  for (let n = 2; ; n++) {
    const [clash] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(and(eq(posts.slug, slug), ne(posts.id, id)))
    if (!clash) return slug
    slug = `${root}-${n}`
  }
}

export const adminSavePost = createServerFn({ method: 'POST' })
  .validator((d: SavePostInput) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const db = getDb()
    const [current] = await db.select().from(posts).where(eq(posts.id, data.id))
    if (!current) throw new Error('Post not found')

    // The address follows the title until the post is first published, then stays put
    // so links people have shared keep working.
    const slug =
      current.publishedAt && current.status === 'published'
        ? current.slug
        : await uniqueSlug(slugify(data.title), data.id)

    const publishing = data.status === 'published'
    await db
      .update(posts)
      .set({
        title: data.title.trim(),
        excerpt: data.excerpt.trim(),
        content: data.content,
        coverImage: data.coverImage,
        status: data.status,
        slug,
        publishedAt: publishing ? (current.publishedAt ?? new Date()) : current.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, data.id))

    // Tags: create any new ones, then replace this post's links.
    const names = [...new Map(data.tags.map((n) => [slugify(n), n.trim()])).entries()].filter(([s]) => s)
    await db.delete(postTags).where(eq(postTags.postId, data.id))
    if (names.length) {
      await db
        .insert(tags)
        .values(names.map(([s, name]) => ({ slug: s, name })))
        .onConflictDoNothing()
      const found = await db
        .select({ id: tags.id })
        .from(tags)
        .where(
          inArray(
            tags.slug,
            names.map(([s]) => s),
          ),
        )
      await db.insert(postTags).values(found.map((t) => ({ postId: data.id, tagId: t.id })))
    }
    return { slug }
  })

export const adminSetPinned = createServerFn({ method: 'POST' })
  .validator((d: { id: number; pinned: boolean }) => ({ id: Number(d.id), pinned: Boolean(d.pinned) }))
  .handler(async ({ data }) => {
    await requireAdmin()
    await getDb().update(posts).set({ pinned: data.pinned }).where(eq(posts.id, data.id))
    return { pinned: data.pinned }
  })

export const adminDeletePost = createServerFn({ method: 'POST' })
  .validator((id: number) => Number(id))
  .handler(async ({ data: id }) => {
    await requireAdmin()
    const db = getDb()
    await db.delete(postTags).where(eq(postTags.postId, id))
    await db.delete(posts).where(eq(posts.id, id))
    return { ok: true }
  })
