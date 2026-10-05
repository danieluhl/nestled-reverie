import { env } from 'cloudflare:workers'
import { createFileRoute } from '@tanstack/react-router'
import { isAdmin } from '#/server/session'

const types: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}
const MAX_BYTES = 15 * 1024 * 1024

// Uploads one image from the editor into R2 and answers with its public path.
export const Route = createFileRoute('/api/images')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!(await isAdmin())) return new Response('Not signed in', { status: 401 })
        const form = await request.formData()
        const file = form.get('file')
        if (!(file instanceof File)) return new Response('No file', { status: 400 })
        const ext = types[file.type]
        if (!ext) return new Response('Please choose a JPG, PNG, WebP, GIF or AVIF image', { status: 415 })
        if (file.size > MAX_BYTES) return new Response('Images can be up to 15 MB', { status: 413 })

        const key = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`
        await env.IMAGES.put(key, file.stream(), { httpMetadata: { contentType: file.type } })
        return Response.json({ url: `/images/${key}` })
      },
    },
  },
})
