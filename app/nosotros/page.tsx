import { getSiteContent } from '@/lib/siteContent'
import ConocerClient from '@/components/ConocerClient'

export const dynamic = 'force-dynamic'

const DEFAULTS = {
  'conocer.hero.title': 'ÉCLAT, de cerca.',
  'conocer.hero.lede': 'ÉCLAT articula salud mental, educación y formación para construir respuestas frente a los desafíos contemporáneos, reconociendo la singularidad de cada trayectoria.',
}

export default async function ConocerPage() {
  const content = await getSiteContent(Object.keys(DEFAULTS))
  const get = (key: keyof typeof DEFAULTS) => content[key] ?? DEFAULTS[key]
  return (
    <ConocerClient
      heroTitle={get('conocer.hero.title')}
      heroLede={get('conocer.hero.lede')}
    />
  )
}
