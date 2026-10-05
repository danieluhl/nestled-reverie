import { createServerFn } from '@tanstack/react-start'
import { adminSession, isAdmin, passwordMatches } from './session'

export const getAdminStatus = createServerFn().handler(async () => ({ admin: await isAdmin() }))

export const login = createServerFn({ method: 'POST' })
  .validator((data: { password: string }) => ({ password: String(data.password ?? '') }))
  .handler(async ({ data }) => {
    if (!(await passwordMatches(data.password))) return { ok: false as const }
    const session = await adminSession()
    await session.update({ admin: true })
    return { ok: true as const }
  })

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await adminSession()
  await session.clear()
  return { ok: true }
})
