import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPost } from '#/server/posts'
import { site } from '#/site/content'
import { SiteLayout } from '#/site/Layout'
import { PostArticle } from '#/site/PostArticle'

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
      <PostArticle post={post} />
    </SiteLayout>
  )
}
