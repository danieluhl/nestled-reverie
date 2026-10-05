import { env } from 'cloudflare:workers'
import { createFileRoute } from '@tanstack/react-router'

// Serves uploaded images from R2. Keys are random, so they can be cached forever.
export const Route = createFileRoute('/images/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const object = await env.IMAGES.get(params._splat ?? '')
        if (!object) return new Response('Not found', { status: 404 })
        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set('etag', object.httpEtag)
        headers.set('cache-control', 'public, max-age=31536000, immutable')
        return new Response(object.body, { headers })
      },
    },
  },
})
