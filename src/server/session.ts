import { getRequestHeaders } from '@tanstack/react-start/server'
import { getAuth } from '#/lib/auth'

export async function currentUser() {
  const session = await getAuth().api.getSession({ headers: getRequestHeaders() })
  return session?.user ?? null
}

export async function isAdmin() {
  return (await currentUser()) !== null
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Not signed in')
}
