import { sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable('posts', {
  id: integer().primaryKey({ autoIncrement: true }),
  slug: text().notNull().unique(),
  title: text().notNull().default(''),
  excerpt: text().notNull().default(''),
  /** Rich text from the editor, stored as HTML. */
  content: text().notNull().default(''),
  /** Path of the cover photograph, e.g. /images/abc.jpg. Empty means the soft placeholder. */
  coverImage: text('cover_image').notNull().default(''),
  status: text({ enum: ['draft', 'published'] }).notNull().default('draft'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const tags = sqliteTable('tags', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
})

export const postTags = sqliteTable(
  'post_tags',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
)
