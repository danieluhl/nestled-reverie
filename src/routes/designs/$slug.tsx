import { createFileRoute, notFound } from '@tanstack/react-router'
import { DesignSwitcher } from '../../designs/DesignSwitcher'
import { designComponents } from '../../designs/components'
import { designLinks } from '../../designs/head'
import { getDesign } from '../../designs/registry'

export const Route = createFileRoute('/designs/$slug')({
  loader: ({ params }) => {
    const design = getDesign(params.slug)
    if (!design) throw notFound()
    return { design }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.design.number}. ${loaderData.design.name} · Nestled Reverie` : 'Nestled Reverie' }],
    links: designLinks,
  }),
  component: DesignPage,
})

function DesignPage() {
  const { design } = Route.useLoaderData()
  const Home = designComponents[design.slug]
  return (
    <>
      <Home />
      <DesignSwitcher current={design} />
    </>
  )
}
