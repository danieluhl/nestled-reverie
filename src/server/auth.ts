import { createServerFn } from '@tanstack/react-start'
import { adminExists } from '#/lib/auth'
import { currentUser } from './session'

export const getAdminStatus = createServerFn().handler(async () => {
  const user = await currentUser()
  return {
    admin: user !== null,
    name: user?.name ?? '',
    // Before anyone has an account, the sign-in page offers to create the author's account.
    needsSetup: user === null && !(await adminExists()),
  }
})
