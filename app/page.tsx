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
  const supabase = createClient()
  const [content, { data: serviciosData }] = await Promise.all([
    getSiteContent(Object.keys(DEFAULTS)),
    supabase.from('servicios').select('nombre, descripcion, imagen_url').order('orden'),
  ])
  const get = (key: keyof typeof DEFAULTS) => content[key] ?? DEFAULTS[key]
  const services = (serviciosData ?? []).map(s => ({
    nombre: s.nombre as string,
    imagen_url: (s.imagen_url ?? null) as string | null,
  }))
  return (
    <HomeClient
      heroTitle={get('home.hero.title')}
      heroLede={get('home.hero.lede')}
      services={services}
    />
  )
}
