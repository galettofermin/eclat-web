import type { Metadata } from 'next'
import { getSiteContent } from '@/lib/siteContent'
import { createClient } from '@/lib/supabase/server'
import HomeClient from '@/components/HomeClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Salud Mental y Educación · ÉCLAT Centro Interdisciplinario, Oncativo',
  alternates: { canonical: 'https://eclatcentro.com' },
}

const DEFAULTS = {
  'home.hero.title': 'Salud mental, educación y acompañamiento interdisciplinario.',
  'home.hero.lede': 'Construimos respuestas singulares frente a los desafíos que presentan las trayectorias de niños, adolescentes, familias e instituciones.',
}

export default async function HomePage() {
  const content = await getSiteContent(Object.keys(DEFAULTS))
  const get = (key: keyof typeof DEFAULTS) => content[key] ?? DEFAULTS[key]

  const supabase = createClient()

  // Consultas en paralelo para reducir latencia
  const [
    { data: latestArticles },
    { data: services },
    { data: featuredCourse },
  ] = await Promise.all([
    supabase
      .from('articles')
      .select('id, title, excerpt, category, image_url')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('servicios')
      .select('nombre, imagen_url')
      .not('imagen_url', 'is', null),
    supabase
      .from('courses')
      .select('id, title, description, price, price_original, badge')
      .eq('published', true)
      .order('sort_order')
      .limit(1)
      .maybeSingle(),
  ])

  return (
    <HomeClient
      heroTitle={get('home.hero.title')}
      heroLede={get('home.hero.lede')}
      latestArticles={latestArticles ?? []}
      services={services ?? []}
      featuredCourse={featuredCourse ?? null}
    />
  )
}
