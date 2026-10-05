import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { getAdminStatus } from '#/server/auth'

export const Route = createFileRoute('/admin/login')({
  loader: async () => {
    const status = await getAdminStatus()
    if (status.admin) throw redirect({ to: '/admin' })
    return status
  },
  component: Login,
})

function Login() {
  const { needsSetup } = Route.useLoaderData()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const res = needsSetup
      ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
      : await authClient.signIn.email({ email: email.trim(), password, rememberMe: true })
    setBusy(false)
    if (res.error) {
      setError(
        needsSetup
          ? (res.error.message ?? 'That account could not be created.')
          : 'That email and password didn’t match.',
      )
      return
    }
    await router.invalidate()
    router.navigate({ to: '/admin' })
  }

  return (
    <div className="ad-login">
      <form onSubmit={submit} className="ad-login-card">
        <span className="ad-logo">Nestled Reverie</span>
        <p>{needsSetup ? 'Create the author account for your writing desk.' : 'Welcome back to your writing desk.'}</p>
        {needsSetup && (
          <input
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-label="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          autoComplete={needsSetup ? 'new-password' : 'current-password'}
          placeholder={needsSetup ? 'Choose a password (10+ characters)' : 'Password'}
          aria-label="Password"
          minLength={needsSetup ? 10 : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <span className="ad-error">{error}</span>}
        <button type="submit" className="ad-btn ad-btn-gold" disabled={busy}>
          {busy ? 'One moment…' : needsSetup ? 'Create account' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
