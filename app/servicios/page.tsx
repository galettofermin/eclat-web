import type { Metadata } from 'next'
import { getSiteContent } from '@/lib/siteContent'
import ServiciosClient from '@/components/ServiciosClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Psicología, psicopedagogía, fonoaudiología, psicomotricidad e inclusión escolar en Oncativo, Córdoba. Atención de niños, adolescentes y familias. Evaluaciones interdisciplinarias para autismo, TDAH, dificultades de aprendizaje y lenguaje.',
  keywords: [
    'autismo Oncativo', 'TDAH Córdoba', 'psicología infantil Oncativo',
    'psicopedagogía infancia', 'fonoaudiología niños', 'inclusión escolar',
    'dificultades de aprendizaje', 'evaluación interdisciplinaria', 'salud mental infancia',
    'adolescencia salud mental', 'orientación familiar', 'psicomotricidad niños',
  ],
  alternates: { canonical: 'https://eclatcentro.com/servicios' },
}

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
