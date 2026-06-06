import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Psicología, psicopedagogía, fonoaudiología, psicomotricidad, inclusión escolar y más. Todos los servicios de ÉCLAT en Oncativo, Córdoba.',
  alternates: { canonical: 'https://eclatcentro.com/servicios' },
  openGraph: {
    title: 'Servicios · ÉCLAT',
    description: 'Psicología, psicopedagogía, fonoaudiología, psicomotricidad e inclusión escolar en Oncativo, Córdoba.',
    url: 'https://eclatcentro.com/servicios',
  },
}

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return children
}
