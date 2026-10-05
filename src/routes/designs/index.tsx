import { createFileRoute } from '@tanstack/react-router'
import { DesignsOverview } from '../../designs/DesignsOverview'
import { designLinks } from '../../designs/head'

export const Route = createFileRoute('/designs/')({
  head: () => ({
    meta: [{ title: 'Home page designs · Nestled Reverie' }],
    links: designLinks,
  }),
  component: DesignsOverview,
})
