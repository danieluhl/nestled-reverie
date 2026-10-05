import { env } from 'cloudflare:workers'
import { useSession as sessionFor } from '@tanstack/react-start/server'

// One person writes this blog, so the admin login is a single password
// (the ADMIN_PASSWORD secret) and a sealed, http-only cookie.

type AdminSession = { admin?: boolean }

export function adminSession() {
  return sessionFor<AdminSession>({
    name: 'nr_admin',
    password: env.SESSION_SECRET,
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
  })
}

export async function isAdmin() {
  const session = await adminSession()
  return session.data.admin === true
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Not signed in')
}

/** Constant-time string comparison, so the password check leaks nothing through timing. */
export async function passwordMatches(attempt: string) {
  const expected = env.ADMIN_PASSWORD
  if (!expected) return false
  const enc = new TextEncoder()
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(attempt)),
    crypto.subtle.digest('SHA-256', enc.encode(expected)),
  ])
  const x = new Uint8Array(a)
  const y = new Uint8Array(b)
  let diff = 0
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i]
  return diff === 0
}
