export async function uploadImage(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const res = await fetch('/api/images', { method: 'POST', body })
  if (!res.ok) throw new Error((await res.text()) || 'Upload failed')
  const { url } = (await res.json()) as { url: string }
  return url
}
