import { getSiteContent } from '@/lib/siteContent'
import ServiciosClient from '@/components/ServiciosClient'

export const dynamic = 'force-dynamic'

const DEFAULTS = {
  'servicios.hero.title': 'Un lugar para cada situación.',
}

export default async function ServiciosPage() {
  const content = await getSiteContent(Object.keys(DEFAULTS))
  const get = (key: keyof typeof DEFAULTS) => content[key] ?? DEFAULTS[key]
  return (
    <ServiciosClient
      heroTitle={get('servicios.hero.title')}
    />
  )
}
