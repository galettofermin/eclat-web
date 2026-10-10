import type { Metadata } from 'next'
import { getSiteContent } from '@/lib/siteContent'
import { createClient } from '@/lib/supabase/server'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Psicólogo en Oncativo · ÉCLAT Centro de Salud Mental y Educación',
}

const DEFAULTS = {
  'home.hero.title': 'Salud mental, educación y acompañamiento interdisciplinario.',
  'home.hero.lede': 'Construimos respuestas singulares frente a los desafíos que presentan las trayectorias de niños, adolescentes, familias e instituciones.',
}

export default async function HomePage() {
  const content = await getSiteContent(Object.keys(DEFAULTS))
  const get = (key: keyof typeof DEFAULTS) => content[key] ?? DEFAULTS[key]

  const supabase = createClient()
  const { data: latestArticles } = await supabase
    .from('articles')
    .select('id, title, excerpt, category, image_url')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <HomeClient
      heroTitle={get('home.hero.title')}
      heroLede={get('home.hero.lede')}
      latestArticles={latestArticles ?? []}
    />
  )
}
