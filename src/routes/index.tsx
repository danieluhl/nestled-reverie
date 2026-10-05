import { createFileRoute, redirect } from '@tanstack/react-router'

// While we choose a direction, the home page points at the design options.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/designs' })
  },
})
