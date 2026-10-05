import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { login } from '#/server/auth'

export const Route = createFileRoute('/admin/login')({
  component: Login,
})

function Login() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    const res = await login({ data: { password } })
    setBusy(false)
    if (!res.ok) {
      setError(true)
      return
    }
    await router.invalidate()
    router.navigate({ to: '/admin' })
  }

  return (
    <div className="ad-login">
      <form onSubmit={submit} className="ad-login-card">
        <span className="ad-logo">Nestled Reverie</span>
        <p>Welcome back to your writing desk.</p>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          aria-label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(false)
          }}
          // biome-ignore lint/a11y/noAutofocus: the only field on the page
          autoFocus
        />
        {error && <span className="ad-error">That password didn’t match.</span>}
        <button type="submit" className="ad-btn ad-btn-gold" disabled={busy || !password}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
