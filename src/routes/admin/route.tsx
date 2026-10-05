import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getAdminStatus } from '#/server/auth'
import adminCss from '#/admin/admin.css?url'

// Everything under /admin needs the admin password, except the sign-in page itself.
// Nothing on the public site links here.
export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/admin/login') return
    const { admin } = await getAdminStatus()
    if (!admin) throw redirect({ to: '/admin/login' })
  },
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }, { title: 'Writing desk · Nestled Reverie' }],
    links: [{ rel: 'stylesheet', href: adminCss }],
  }),
  component: () => (
    <div className="ad">
      <Outlet />
    </div>
  ),
})
